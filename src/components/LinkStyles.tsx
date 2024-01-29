import styled from "styled-components";

/**
 * A container that styles links (<a> elements) within its children to have a
 * yellow hover background.
 */
export const LinkStyleHover = styled.div`
    a:hover {
        background-color: hsl(60, 100%, 85%);
        color: oklch(40% 0 0);
        @media (prefers-color-scheme: dark) {
            background-color: yellow;
            color: oklch(20% 0 0);
        }
    }
`;

/**
 * A container that styles links (<a> elements) within its children to behave
 * like "old-school" HTML links.
 *
 * - Links will have a blue underline. Visited links will have a purple
 *   underline.
 *
 * - Hover state will show a yellow background.
 */
export const LinkStyleUnderlined = styled(LinkStyleHover)`
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
    }
`;

/**
 * A container that styles links (<a> elements) within its children to look
 * less conspicous within the text.
 *
 * - Links will have the same color and underline as the current color, without
 *   any distinction between visited and unvisited links.
 *
 * - Hover state will show a yellow background.
 */
export const LinkStyleInherited = styled(LinkStyleHover)`
    a {
        text-decoration: none;
        border-bottom: 1px solid currentColor;
    }

    a:hover {
        border-bottom-color: transparent;
    }
`;

/**
 * A container that styles links (<a> elements) within its children to have a
 * yellow hover background.
 *
 * This is a subset of {@link LinkStyleUnderlined}.
 *
 * - Links will be bold, but will not have a text decoration. Instead,
 *   --mrmr-tertiary-color, which is by default a 70% opacity variation of
 *   --mrmr-text-color, will be used as the link color.
 *
 * - Hover state will show a yellow background.
 */
export const LinkStyleBoldHover = styled.div`
    a {
        text-decoration: none;
        font-weight: 500;
    }

    a:visited {
        color: var(--mrmr-tertiary-color);
    }

    /* We need to inline LinkStyleHover here because otherwise the a:visited
       color overrides the a:hover color since the a:visited comes later in the
       source order */
    a:hover {
        background-color: hsl(60, 100%, 85%);
        color: oklch(40% 0 0);
        @media (prefers-color-scheme: dark) {
            background-color: yellow;
            color: oklch(20% 0 0);
        }
    }
`;
