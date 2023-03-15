import { Scheduler } from "@strudel.cycles/core";
import { initAudioOnFirstClick } from "@strudel.cycles/webaudio";
import { IconButton } from "components/Buttons";
import { HydraCanvas } from "components/HydraCanvas";
import type { PageColors } from "parsers/page-colors";
import * as React from "react";
import { BsPlayFill } from "react-icons/bs";
import { connectWebAudio } from "strudel/webaudio";
import styled from "styled-components";
import type { HydraVis, TidalSong } from "types";

interface PlayerProps {
    /** The visualization to render */
    vis: HydraVis;
    /** The song to play */
    song: TidalSong;
    /** Page colors */
    colors?: PageColors;
}

/**
 * Show a full screen with a title section and a player.
 *
 * The player takes up at least the first screen height, obtained by stacking
 * the title section (specified as `children`) and an HTML canvas rendering the
 * visuals.
 */
export const Player: React.FC<React.PropsWithChildren<PlayerProps>> = ({
    vis,
    song,
    children,
}) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const schedulerRef = React.useRef<Scheduler | null>(null);

    // Keep the canvas hidden until the first playback
    //
    // Hydra clears the canvas to a black color. This causes the black canvas to
    // be displayed until we render the first frame, which only happens if the
    // user starts playing.
    //
    // We could patch Hydra to instead clear to our background color. However,
    // it is perhaps simpler for now for us to just not show the canvas until
    // the first frame is rendered.
    const [hasUserInitiatedPlayback, setHasUserInitiatedPlayback] =
        React.useState(false);

    const handleClick: React.MouseEventHandler = (e) => {
        // Toggle the isPlaying state.
        setIsPlaying(!isPlaying);
        // Show the canvas (note that we never hide it again; see the comment
        // above `hasUserInitiatedPlayback` for more details).
        setHasUserInitiatedPlayback(true);
        e.preventDefault();
    };

    React.useEffect(() => {
        initAudioOnFirstClick();
    }, []);

    React.useEffect(() => {
        // Creating an AudioContext if the user has not clicked on the webpage
        // casues the browser to print a warning on the console. So only proceed
        // after the first playback has started.
        if (!hasUserInitiatedPlayback) return;

        const scheduler = connectWebAudio();
        schedulerRef.current = scheduler;

        scheduler.setPattern(song());

        if (isPlaying) scheduler.start();

        // Destroy the current scheduler, we'll recreate a new one, when the
        // song changes.
        return () => scheduler.stop();
    }, [hasUserInitiatedPlayback, song]);

    React.useEffect(() => {
        const scheduler = schedulerRef.current;

        // Initial playback has not been initiated.
        if (!scheduler) return;

        if (isPlaying) {
            scheduler.start();
        } else {
            scheduler.pause();
        }
    }, [isPlaying]);

    return (
        <Container>
            <FirstScreen>
                {children}
                <CanvasGrid onClick={handleClick} title="">
                    <CanvasContainer isVisible={hasUserInitiatedPlayback}>
                        <HydraCanvas {...{ vis, isPlaying }} />
                    </CanvasContainer>
                    <PlayButtonOverlay isVisible={!isPlaying}>
                        <PlayButton />
                    </PlayButtonOverlay>
                </CanvasGrid>
            </FirstScreen>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const FirstScreen = styled.div`
    display: flex;
    flex-direction: column;
    height: 100svh;
`;

const CanvasGrid = styled.div`
    flex-grow: 1;
    margin-bottom: 1.8rem;

    display: grid;
`;

interface CanvasContainerProps {
    isVisible: boolean;
}

const CanvasContainer = styled.div<CanvasContainerProps>`
    display: ${(props) => (props.isVisible ? "block" : "none")};
    grid-area: 1/-1;

    /* The canvas itself is "position: absolute" */
    position: relative;
`;

interface PlayButtonOverlayProps {
    isVisible: boolean;
}

const PlayButtonOverlay = styled.div<PlayButtonOverlayProps>`
    background-color: rgba(72, 65, 79, 0.15);
    backdrop-filter: blur(13px);

    grid-area: 1/-1;

    display: ${(props) => (props.isVisible ? "grid" : "none")};
    place-items: center;
`;

const PlayButton: React.FC = () => {
    return (
        <IconButton>
            <BsPlayFill size="2rem" title="Play" />
        </IconButton>
    );
};
