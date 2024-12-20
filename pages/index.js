// // pages/index.js
// import { useState } from "react";

// export default function Home() {
//   const [url, setUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleConvert = async () => {
//     setLoading(true);

//     try {
//       // const response = await fetch("http://127.0.0.1:5000/convert", {
//       //   method: "POST",
//       //   headers: {
//       //     "Content-Type": "application/json",
//       //   },
//       //   body: JSON.stringify({ url }),
//       // });

//       const response = await fetch("https://convertisseur-mp3-c3bbe80142b8.herokuapp.com/convert", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ url }),
//       });

//       //console.log(await response.json()); // Affiche la réponse complète du backend


//       if (!response.ok) throw new Error("Échec de la conversion");

//       // Créer un lien pour télécharger le fichier
//       const blob = await response.blob();
//       console.log('blob', blob);

//       const downloadUrl = window.URL.createObjectURL(blob);
//       //const link = document.createElement("a");
//       //link.href = downloadUrl;
//       //link.download = "audio.mp3";
//       //link.click();
//       window.URL.revokeObjectURL(downloadUrl);
//     } catch (error) {
//       console.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Convertisseur YouTube en MP3</h1>
//       <input
//         type="text"
//         placeholder="Entrez l'URL YouTube"
//         value={url}
//         onChange={(e) => setUrl(e.target.value)}
//       />
//       <button onClick={handleConvert} disabled={loading}>
//         {loading ? "Conversion..." : "Convertir"}
//       </button>
//     </div>
//   );
// }



// pages/index.js


import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState(""); // Stocke l'URL saisie par l'utilisateur
  const [loading, setLoading] = useState(false); // Indique si le processus de conversion est en cours
  const [error, setError] = useState(""); // Stocke les erreurs éventuelles

  const handleConvert = async () => {
    setLoading(true); // Active le mode de chargement
    setError(""); // Réinitialise les erreurs avant de commencer

    try {
      // Appel à l'API Flask hébergée sur Heroku
      const response = await fetch("https://convertisseur-mp3-c3bbe80142b8.herokuapp.com/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }), // Envoi de l'URL YouTube au backend
      });

      // Vérification du statut de la réponse
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la conversion");
      }

      // Téléchargement du fichier MP3
      const blob = await response.blob(); // Récupère le fichier sous forme de blob
      const downloadUrl = window.URL.createObjectURL(blob); // Crée une URL pour le téléchargement
      const link = document.createElement("a"); // Crée un élément <a>
      link.href = downloadUrl; // Attribue l'URL au lien
      link.download = "audio.mp3"; // Définit le nom du fichier
      document.body.appendChild(link); // Ajoute le lien au DOM pour le déclencher
      link.click(); // Simule un clic pour lancer le téléchargement
      link.remove(); // Supprime le lien du DOM après utilisation
      window.URL.revokeObjectURL(downloadUrl); // Libère l'URL temporaire
    } catch (error) {
      console.error(error.message); // Log l'erreur dans la console
      setError(error.message); // Affiche l'erreur dans l'interface utilisateur
    } finally {
      setLoading(false); // Désactive le mode de chargement
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Convertisseur YouTube en MP3</h1>
      <input
        type="text"
        placeholder="Entrez l'URL YouTube"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
      />
      <br />
      <button
        onClick={handleConvert}
        disabled={loading || !url.trim()}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#ccc" : "#0070f3",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Conversion en cours..." : "Convertir"}
      </button>
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <strong>Erreur : </strong>
          {error}
        </div>
      )}
    </div>
  );
}
