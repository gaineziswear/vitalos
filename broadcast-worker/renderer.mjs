import { createProgramme } from './programme.mjs'

export function renderFilterGraph(programme) {
  const title = programme.title.replace(/[:'"]/g, '')
  const label = programme.label.replace(/[:'"]/g, '')
  const narration = programme.narration.replace(/[:'"]/g, '').slice(0, 180)
  return [
    'drawbox=x=0:y=0:w=iw:h=ih:color=black@0.12:t=fill',
    `drawtext=text='VITALOS':x=48:y=42:fontsize=34:fontcolor=white`,
    `drawtext=text='${title}':x=48:y=150:fontsize=46:fontcolor=white`,
    `drawtext=text='${label}':x=48:y=220:fontsize=28:fontcolor=white`,
    `drawtext=text='${narration}':x=48:y=h-150:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=18`,
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
