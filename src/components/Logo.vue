<template>
  <div class="logo-wrapper">
    <svg
      viewBox="0 0 600 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      
      
      <text x="20" y="80" class="logo-text" fill="#66baff">C</text>
      <text x="80" y="80" class="logo-text" fill="#66baff">A</text>
      <text x="140" y="80" class="logo-text" fill="#66baff">P</text>

      <!-- Phone body -->
      <rect x="200" y="30" width="40" height="70" rx="8" fill="#ffaa33" />
      
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

      <text x="260" y="80" class="logo-text" fill="#66baff">A</text>
      <text x="320" y="80" class="logo-text" fill="#66baff">S</text>
    </svg>
  </div>
</template>

<style scoped>
.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scale(7);
  transform-origin: top left;
  margin-top: 0px;
}

.logo-text {
  font-family: Arial, sans-serif;
  font-size: 60px;
  font-weight: bold;
}
</style>
