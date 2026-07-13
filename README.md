# AdrianZgzDev — Portfolio

Portfolio personal de **Adrián Zgz (AdrianZgzDev)**, publicado con **GitHub Pages** en dominio propio:

🌐 **[adrianzgzdev.com](https://www.adrianzgzdev.com/)**

Técnico Electromecánico con 25+ años de experiencia industrial en transición hacia **Mobile Robotics** (ROS 2, Nav2) y desarrollo **Full-Stack** (Python, FastAPI, React) aplicado a sistemas **AGV/AMR**.

## 🧱 Stack del sitio

Es una web estática de una sola página, **sin framework y sin paso de build**:

- `index.html` — toda la página: HTML + CSS (en `<style>`) + JS (en `<script>`) en un único archivo.
- `assets/` — iconos, imagen de marca y capturas de proyectos.
- `CNAME` — dominio personalizado.
- Fuente **Orbitron** (Google Fonts) usada solo para el logotipo/marca.
- Diseño oscuro con fondos de gradiente radial y acento cian (`--brand: #00e5ff`), gestionado con custom properties CSS en `:root`.

## 📇 Formulario de contacto

El formulario envía los datos (vía `FormData`) a un **webhook de n8n** auto-alojado, protegido por:

- **Cloudflare Turnstile** (modo invisible) contra bots.
- Un campo **honeypot** oculto como segunda barrera anti-spam.

## 🚀 Proyectos destacados

| Proyecto | Descripción | Stack |
| --- | --- | --- |
| [agv_logistics_nav2](https://github.com/adrianzgzdev/agv_logistics_nav2) | Plataforma autónoma de logística AGV con navegación, misiones, supervisión de seguridad y dashboard web en tiempo real | ROS 2 · Nav2 · FastAPI · WebSocket · React |
| [partes](https://github.com/adrianzgzdev/partes) | Gestión de partes / pedido de servicios | Full-Stack |
| [n8n-ai-contact-router](https://github.com/adrianzgzdev/n8n-ai-contact-router) | Enrutado inteligente de mensajes de contacto con IA | n8n · Webhooks · OpenAI API |
| Infraestructura Self-Hosted | Servicios propios en VPS | Hetzner · Docker Swarm · Traefik v3 · TLS |

## 🛠️ Desarrollo local

No hay dependencias ni herramientas de build. Basta con abrir `index.html` en el navegador, o levantar un servidor estático:

```bash
python3 -m http.server
```

## 📦 Despliegue

Cada `push` a `main` publica automáticamente en GitHub Pages. Los enlaces a recursos usan rutas relativas a la raíz, que funcionan gracias al dominio personalizado (`CNAME`).

## 📬 Contacto

- 🌐 [adrianzgzdev.com](https://www.adrianzgzdev.com/)
- 💼 [LinkedIn](https://www.linkedin.com/in/adrianzgzdev)
- 🐙 [GitHub](https://github.com/adrianzgzdev)
- ✉️ adrianzgzdev@gmail.com
