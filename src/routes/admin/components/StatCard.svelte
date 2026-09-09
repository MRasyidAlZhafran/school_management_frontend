<script>
  let {
    title,
    value,
    label = '',
    badge = '',
    subValue = null,
    icon,
    iconColor = 'text-emerald-600',
    textColor = 'text-slate-900',
    valueColor = textColor,
    subInfo = undefined
  } = $props();
</script>

<div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-5">
  <div class="flex items-start justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="p-3 bg-emerald-50 rounded-xl {iconColor}">
        <span class="material-icons-outlined text-2xl">{icon}</span>
      </div>
      <p class="text-sm text-slate-600 font-medium leading-snug">{title}</p>
    </div>
    {#if badge}
      <span class="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 whitespace-nowrap">
        {badge}
      </span>
    {/if}
  </div>

  <div class="flex-1 flex flex-col justify-end">
    <p class="{valueColor} text-4xl font-extrabold tracking-tight">
      {value}
    </p>
    {#if label}
      <p class="text-sm text-slate-500 mt-1">{label}</p>
    {/if}
    {#if subValue}
      <p class="text-xs text-slate-400 mt-1">{subValue}</p>
    {/if}
  </div>

  {@render subInfo?.()}
</div>