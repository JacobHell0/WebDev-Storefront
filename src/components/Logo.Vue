<template>
  <div class="logo-wrapper">
    <svg
      viewBox="0 0 600 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blue3D" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#66baff" />
          <stop offset="50%" stop-color="#0077cc" />
          <stop offset="100%" stop-color="#003f80" />
        </linearGradient>
        <linearGradient id="phoneGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffaa33" />
          <stop offset="30%" stop-color="#ff6600" />
          <stop offset="100%" stop-color="#cc4400" />
        </linearGradient>
        <linearGradient id="reflectionGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="white" stop-opacity="0.6" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
      </defs>

      <text x="20" y="80" class="logo-text" fill="url(#blue3D)">C</text>
      <text x="80" y="80" class="logo-text" fill="url(#blue3D)">A</text>
      <text x="140" y="80" class="logo-text" fill="url(#blue3D)">P</text>

      <rect x="200" y="30" width="40" height="70" rx="8" fill="url(#phoneGradient)" />
      <rect x="200" y="30" width="40" height="20" rx="8" fill="url(#reflectionGradient)" />
      <circle cx="220" cy="95" r="4" fill="white" />
      <text
        x="220"
        y="65"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="52.5"
        font-family="Arial, sans-serif"
        font-weight="bold"
        fill="white"
      >
        J
      </text>

      <text x="260" y="80" class="logo-text" fill="url(#blue3D)">A</text>
      <text x="320" y="80" class="logo-text" fill="url(#blue3D)">S</text>
    </svg>
  </div>
</template>

<style scoped>

.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scale(7); /* ← Bigger now */
  transform-origin: top left; /* keeps it positioned near top/left */
  margin-top: 0px;
}

.logo-text {
  font-family: Arial, sans-serif;
  font-size: 60px;
  font-weight: bold;
}
</style>
