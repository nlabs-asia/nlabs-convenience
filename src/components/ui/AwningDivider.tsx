/** Pita awning hijau-putih-biru khas gerai FamilyMart (signature brand). */
export default function AwningDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`awning h-6 w-full ${flip ? "scale-y-[-1]" : ""}`}
      aria-hidden="true"
    />
  );
}
