# Google Analytics - Guía de Configuración

## 📋 Pasos para configurar Google Analytics

### 1. Crear cuenta de Google Analytics
1. Ve a [analytics.google.com](https://analytics.google.com)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Empezar a medir"
4. Configura tu cuenta:
   - Nombre de cuenta: "ASP America Pro Clubs"
   - País: Panamá
   - Moneda: USD

### 2. Configurar Propiedad
1. Nombre de propiedad: "ASP Website"
2. Zona horaria: (UTC-05:00) América/Panamá
3. Moneda: Dólar estadounidense
4. Selecciona "Web" como plataforma

### 3. Configurar flujo de datos
1. URL del sitio web: tu dominio (ej: aspclubs.com)
2. Nombre del flujo: "ASP Main Site"
3. **IMPORTANTE**: Copia el ID de medición (formato: G-XXXXXXXXXX)

### 4. Implementar el código
1. Abre `index.html`, `jugadores.html`, `standings.html`, `clips.html`
2. Descomenta las líneas 13-21 en cada archivo
3. Reemplaza `GA_MEASUREMENT_ID` con tu ID real
4. Guarda todos los archivos

### 5. Verificar instalación
- En Google Analytics, ve a "Tiempo real"
- Visita tu sitio web
- Deberías ver tu visita en tiempo real

## 📊 Dónde ver las estadísticas

### Dashboard principal: [analytics.google.com](https://analytics.google.com)

**Informes principales:**
- **Tiempo real**: Visitantes actuales
- **Audiencia**: Datos demográficos, dispositivos
- **Adquisición**: De dónde vienen los visitantes
- **Comportamiento**: Páginas más visitadas, tiempo en sitio
- **Conversiones**: Objetivos personalizados

**Métricas clave que verás:**
- Usuarios únicos diarios/mensuales
- Sesiones totales
- Duración promedio de sesión
- Páginas por sesión
- Tasa de rebote
- Países de origen
- Dispositivos más usados

## 🚀 Rendimiento
- **Tamaño**: ~10KB adicionales
- **Carga**: Asíncrona, no bloquea la página
- **Impacto**: Mínimo en velocidad de carga
