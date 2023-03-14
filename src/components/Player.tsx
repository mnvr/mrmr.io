import { Scheduler } from "@strudel.cycles/core";
import { initAudioOnFirstClick } from "@strudel.cycles/webaudio";
import { IconButton } from "components/Buttons";
import { Column } from "components/Column";
import { HydraCanvas } from "components/HydraCanvas";
import * as React from "react";
import { BsPlayFill } from "react-icons/bs";
import { connectWebAudio } from "strudel/webaudio";
import styled from "styled-components";
import type { HydraVis, TidalSong } from "types";
import { ensure } from "utils/parse";

interface PlayerProps {
    /** The visualization to render */
    vis: HydraVis;
    /** The song to play */
    song: TidalSong;
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
    const [shouldShowCanvas, setShouldShowCanvas] = React.useState(false);

    const handleClick: React.MouseEventHandler = (e) => {
        // Toggle the isPlaying state.
        setIsPlaying(!isPlaying);
        // Show the canvas (note that we never hide it again; see the comment
        // above `shouldShowCanvas` for more details).
        setShouldShowCanvas(true);
        e.preventDefault();
    };

    React.useEffect(() => {
        initAudioOnFirstClick();
    }, []);

    React.useEffect(() => {
        const scheduler = connectWebAudio();
        schedulerRef.current = scheduler;

        scheduler.setPattern(song());

        if (isPlaying) scheduler.start();

        // Destroy the current scheduler, we'll recreate a new one, when the
        // song changes.
        return () => scheduler.stop();
    }, [song]);

    React.useEffect(() => {
        const scheduler = ensure(schedulerRef.current);
        if (isPlaying) {
            scheduler.start();
        } else {
            scheduler.pause();
        }
    }, [isPlaying]);

    return (
        <Container>
            {children}
            <CanvasGrid onClick={handleClick} title="">
                <CanvasContainer isVisible={shouldShowCanvas}>
                    <HydraCanvas {...{ vis, isPlaying }} />
                </CanvasContainer>
                <PlayButtonOverlay isVisible={!isPlaying}>
                    <PlayButton />
                </PlayButtonOverlay>
            </CanvasGrid>
        </Container>
    );
};

const Container = styled.div`
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

const PlayButton: React.FC<React.HTMLAttributes<HTMLButtonElement>> = (
    props
) => {
    return (
        <IconButton hoverColor="hsl(0, 0%, 100%)" {...props}>
            <BsPlayFill size="2rem" title="Play" />
        </IconButton>
    );
};
