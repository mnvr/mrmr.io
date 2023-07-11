import { FooterA } from "components/FooterA";
import { PlayerP5 } from "components/PlayerP5";
import { PlayerP5WebAudio } from "components/PlayerP5WebAudio";
import * as React from "react";
import { BuildTimePageContext } from "templates/page";
import { P5Draw } from "types";
import { ensure } from "utils/ensure";
import { onlyValue } from "utils/object";
import { createLoopSequencer } from "webaudio/audio";

interface P5LayoutProps {
    /**
     * The P5 visualization to render
     *
     * See the draw property in {@link PlayerP5WebAudioProps} for more details.
     */
    draw: P5Draw;
}

/**
 * A layout that shows a P5 sketch, sized as per the aspect ratio of an
 * Instagram Reel. If the page has an associated MP3 file, the layout shows a
 * player; otherwise an autoplaying sketch is drawn.
 *
 * Unlike the basic layout, this one is directly imported in the MDX. This is
 * because it needs to be passed the `draw` function.
 */
export const P5Layout: React.FC<P5LayoutProps> = ({ draw }) => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { mp3s } = page;

    const onlyMP3URL = onlyValue(mp3s);

    return (
        <div>
            {onlyMP3URL ? (
                <PlayerP5WebAudio
                    draw={draw}
                    sequencer={createLoopSequencer(onlyMP3URL)}
                />
            ) : (
                <PlayerP5 draw={draw} />
            )}
            <FooterA />
        </div>
    );
};

export default P5Layout;
