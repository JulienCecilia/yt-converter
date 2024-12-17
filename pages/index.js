// pages/index.js
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      //console.log(await response.json()); // Affiche la réponse complète du backend


      if (!response.ok) throw new Error("Échec de la conversion");

      // Créer un lien pour télécharger le fichier
      const blob = await response.blob();
      console.log('blob', blob);

      const downloadUrl = window.URL.createObjectURL(blob);
      //const link = document.createElement("a");
      //link.href = downloadUrl;
      //link.download = "audio.mp3";
      //link.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Convertisseur YouTube en MP3</h1>
      <input
        type="text"
        placeholder="Entrez l'URL YouTube"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleConvert} disabled={loading}>
        {loading ? "Conversion..." : "Convertir"}
      </button>
    </div>
  );
}
