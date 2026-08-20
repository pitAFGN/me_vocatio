const WOMPI_SCRIPT_SRC = "https://checkout.wompi.co/widget.js";

/**
 * Se asegura de que el script de Wompi esté cargado en la página.
 * Si ya está, no lo vuelve a poner.
 */
function cargarScriptWompi() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No hay ventana de navegador"));

    if (window.WidgetCheckout) return resolve();

    const existente = document.querySelector(`script[src="${WOMPI_SCRIPT_SRC}"]`);
    if (existente) {
      existente.addEventListener("load", () => resolve());
      existente.addEventListener("error", () => reject(new Error("No se pudo cargar Wompi")));
      return;
    }

    const script = document.createElement("script");
    script.src = WOMPI_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Wompi"));
    document.body.appendChild(script);
  });
}

/**
 * Abre la ventana de pago de Wompi con los datos que devuelve el backend
 * (endpoint /api/payment/crear -> campo "widget").
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
    redirectUrl: widget.redirectUrl,
    signature: { integrity: widget.signature },
  });

  checkout.open((resultado) => {
    onResultado?.(resultado?.transaction || null);
  });
}
