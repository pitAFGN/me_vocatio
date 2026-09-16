const WOMPI_SCRIPT_SRC = "https://checkout.wompi.co/widget.js";
const TIEMPO_MAXIMO_CARGA_MS = 10000;

// Promesa compartida: evita que dos clics simultáneos inserten el script dos veces
// y evita el problema de "quedarse esperando para siempre" si el script ya existía
// en el DOM de un intento anterior (fallido) cuyos eventos load/error ya se dispararon.
let promesaScriptWompi = null;

function cargarScriptWompi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("No hay ventana de navegador"));
  }

  if (window.WidgetCheckout) return Promise.resolve();

  if (promesaScriptWompi) return promesaScriptWompi;

  promesaScriptWompi = new Promise((resolve, reject) => {
    // Si había un <script> de un intento anterior, lo quitamos: así garantizamos
    // que el <script> nuevo dispare sus propios eventos load/error de forma confiable.
    const existente = document.querySelector(`script[src="${WOMPI_SCRIPT_SRC}"]`);
    if (existente) existente.remove();

    const timeoutId = setTimeout(() => {
      promesaScriptWompi = null;
      reject(new Error("Wompi tardó demasiado en cargar. Revisa tu conexión o si un bloqueador de anuncios está interfiriendo."));
    }, TIEMPO_MAXIMO_CARGA_MS);

    const script = document.createElement("script");
    script.src = WOMPI_SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      clearTimeout(timeoutId);
      resolve();
    };
    script.onerror = () => {
      clearTimeout(timeoutId);
      promesaScriptWompi = null;
      reject(new Error("No se pudo cargar Wompi. Revisa tu conexión o si un bloqueador de anuncios está interfiriendo."));
    };
    document.body.appendChild(script);
  });

  return promesaScriptWompi;
}

/**
 * Abre la ventana de pago de Wompi con los datos que devuelve el backend
 * (endpoint /api/pagos/crear o /api/pagos/premium -> campo "widget").
 *
 * onResultado(transaction) se llama cuando el usuario cierra el checkout,
 * con la transacción que quedó (o null si la cerró sin pagar).
 */
export async function abrirCheckoutWompi(widget, onResultado) {
  await cargarScriptWompi();

  const checkout = new window.WidgetCheckout({
    currency: widget.currency,
    amountInCents: widget.amountInCents,
    reference: widget.reference,
    publicKey: widget.publicKey,
    // NOTA: no pasamos "redirectUrl" a propósito. Si se pasa, Wompi hace una
    // redirección de página completa a esa URL en cuanto termina la transacción,
    // en vez de (o antes de) invocar el callback de abajo. Como ya manejamos
    // el resultado con ese callback (bootstrapTransport: "postmessage" lo trae
    // sin salir de la página), dejamos que sea la única fuente de verdad.
    signature: { integrity: widget.signature },
    bootstrapTransport: "postmessage",
  });

  checkout.open((resultado) => {
    onResultado?.(resultado?.transaction || null);
  });
}
