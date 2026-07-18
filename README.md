# ALESTEDUARTE RESERVAS — MVP visual 0.1

Esta carpeta contiene una primera web responsive preparada con el material aportado por ALESTEDUARTE.

## Qué funciona
- Página de inicio con vídeo.
- Presentación de las dos rutas.
- Galería, información y contacto.
- Formulario visual de reserva.
- Cálculo del precio por número de motos.
- Regla visual de horarios para la ruta de 60 minutos.

## Qué todavía NO está conectado
- Google Calendar API.
- Calendario azul `ONLINE`.
- Comprobación real de disponibilidad.
- TPV / pago con tarjeta.
- Correos automáticos.
- Base de datos.
- Consentimientos legales definitivos.

Por seguridad, el formulario está en modo maqueta y no confirma reservas reales.

## Publicación en IONOS
1. Confirmar que el contrato incluye alojamiento web, no solo dominios.
2. Abrir el espacio web o FTP de IONOS.
3. Subir el contenido de esta carpeta a la raíz del dominio.
4. Comprobar que `index.html` es la página de inicio.
5. Activar SSL/HTTPS.

## Siguiente paso técnico
Conectar un backend seguro a:
1. Google Calendar para leer eventos y crear reservas en `ONLINE`.
2. TPV para cobrar el 100 % antes de crear la reserva.
3. Base de datos para conservar la reserva si Google Calendar falla.
