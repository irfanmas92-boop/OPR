import React from 'react';
import {Composition, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Wedding} from './Wedding';
import TL from './timeline.json';

loadFont({family: 'GreatVibes', url: staticFile('fonts/GreatVibes.woff2')});
loadFont({family: 'Cormorant', url: staticFile('fonts/cormorant-garamond-latin-500-italic.woff2'), style: 'italic', weight: '500'});
loadFont({family: 'Cormorant', url: staticFile('fonts/cormorant-garamond-latin-500-normal.woff2'), weight: '500'});
loadFont({family: 'Cinzel', url: staticFile('fonts/cinzel-latin-500-normal.woff2'), weight: '500'});

export const Root: React.FC = () => (
  <>
    <Composition id="Wedding" component={Wedding} durationInFrames={TL.total} fps={TL.fps} width={1080} height={1920} defaultProps={{withAudio: 'audio/mix.wav'}} />
    <Composition id="WeddingSfxOnly" component={Wedding} durationInFrames={TL.total} fps={TL.fps} width={1080} height={1920} defaultProps={{withAudio: 'audio/sfx_only.wav'}} />
  </>
);
