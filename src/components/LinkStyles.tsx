import styled from "styled-components";

/**
 * A container that styles links (<a> elements) within its children to behave
 * like "old-school" HTML links.
 *
 * - Links will have a blue underline. Visited links will have a purple
 *   underline.
 *
 * - Hover state will show a yellow background.
 */
export const LinkStyleUnderlined = styled.div`
    a {
        text-decoration: none;
        border-bottom: 1px solid blue;
        font-weight: 500;
    }

    @media (prefers-color-scheme: dark) {
        a {
            border-bottom-color: royalblue;
        }
    }

    a:visited {
        border-bottom-color: purple;
    }

    a:hover {
        border-bottom-color: transparent;
        background-color: hsl(60, 100%, 85%);
        color: oklch(40% 0 0);
        @media (prefers-color-scheme: dark) {
            background-color: yellow;
            color: oklch(20% 0 0);
        }
    }
`;
