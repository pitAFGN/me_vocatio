import NotFoundContent from "./not-found-content";

export const metadata = {
  title: "Página No Encontrada",
  description: "La página que buscas no existe o fue movida.",
};

export default function NotFound() {
  return <NotFoundContent />;
}
