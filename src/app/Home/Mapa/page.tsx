import Mapa from './Mapa';

export default function Page() {
  return (
    <div className="w-full p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Mapa Interactivo
        </h1>
        <Mapa />
      </div>
    </div>
  );
}