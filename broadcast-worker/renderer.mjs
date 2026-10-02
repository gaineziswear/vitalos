function escapeDrawtext(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\\\'")
    .replace(/:/g, '\\\\:')
    .replace(/%/g, '\\\\%')
    .replace(/,/g, '\\\\,')
    .slice(0, 220)
}

export function renderFilterGraph(programme) {
  const title = escapeDrawtext(programme.title)
  const label = escapeDrawtext(programme.label)
  const narration = escapeDrawtext(programme.narration)
  const cards = (programme.cards ?? []).slice(0, 3)
    .map(card => `${card.title}: ${card.value}`)
    .join(' | ')
  const cardText = escapeDrawtext(cards)
  return [
    'drawbox=x=0:y=0:w=iw:h=ih:color=0x07111f@1:t=fill',
    'drawbox=x=36:y=28:w=1208:h=664:color=0xd4af37@0.22:t=2',
    `drawtext=text='VITALOS':x=48:y=42:fontsize=34:fontcolor=0xd4af37`,
    `drawtext=text='${title}':x=48:y=125:fontsize=42:fontcolor=white`,
    `drawtext=text='${label}':x=48:y=190:fontsize=24:fontcolor=0xd4af37`,
    `drawtext=text='${cardText}':x=48:y=270:fontsize=21:fontcolor=white:box=1:boxcolor=black@0.35:boxborderw=16`,
    `drawtext=text='${narration}':x=48:y=h-155:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.65:boxborderw=18`,
    `drawtext=text='EVIDENCE FIRST | ATTACK CLAIMS, NOT PEOPLE':x=48:y=h-48:fontsize=16:fontcolor=0xd4af37`,
    'format=yuv420p',
  ].join(',')
}

export function encoderArgs(programme) {
  const filter = renderFilterGraph(programme)
  return [
    '-hide_banner', '-loglevel', 'warning', '-re',
    '-f', 'lavfi', '-i', 'color=c=0x07111f:s=1280x720:r=30',
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
    '-vf', filter, '-t', String(programme.duration),
    '-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'zerolatency',
    '-pix_fmt', 'yuv420p', '-r', '30', '-g', '60',
    '-b:v', '4500k', '-maxrate', '4500k', '-bufsize', '9000k',
    '-c:a', 'aac', '-b:a', '160k', '-ar', '48000',
    '-f', 'flv',
  ]
}
