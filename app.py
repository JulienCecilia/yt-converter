# app.py
from flask import Flask, request, jsonify, send_file
import os
import yt_dlp
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Active CORS pour toutes les routes et tous les domaines


@app.route('/convert', methods=['POST'])
def convert_video():
    try:
        # Récupérer l'URL depuis la requête
        data = request.json
        youtube_url = data['url']
        
        # Créer un chemin temporaire pour stocker le fichier
        # download_path = "downloads"
        # os.makedirs(download_path, exist_ok=True)
        
        # Chemin vers le dossier Téléchargements
        DOWNLOAD_FOLDER = os.path.join(os.path.expanduser("~"), "Downloads")
        os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)  # Crée le dossier s'il n'existe pas
        
        # Télécharger et convertir en MP3
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': f'{DOWNLOAD_FOLDER}/%(title)s.%(ext)s',
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(youtube_url, download=True)
            file_path = f"{DOWNLOAD_FOLDER}/{info['title']}.mp3"
        
        # Retourner le fichier MP3
        return send_file(file_path, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# if __name__ == "__main__":
#     app.run(debug=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
