# date-site-ready v6

Run locally from this folder:

```bash
python3 -m http.server 9010
```

Then open `http://127.0.0.1:9010`.

## Important audio note
The intro `hoa_hoa.mp3` is configured to loop continuously and the page attempts to start it automatically. Modern browsers can block **audible autoplay** before any user gesture. A webpage cannot bypass that browser policy. There is intentionally no enable-audio overlay. YES/NO/SOPAR sounds are click-triggered and should play normally.

Open DevTools Console and confirm `date-site build: v6` if you suspect an old cached version.
