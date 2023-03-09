declare module "hydra-synth" {
    export default HydraRenderer;
    /// Create a new Hydra instance
    class HydraRenderer {
        constructor({
            pb,
            width,
            height,
            numSources,
            numOutputs,
            makeGlobal,
            autoLoop,
            detectAudio,
            enableStreamCapture,
            canvas,
            precision,
            extendTransforms,
        }?: {
            pb?: any;
            width?: number;
            height?: number;
            numSources?: number;
            numOutputs?: number;
            makeGlobal?: boolean;
            autoLoop?: boolean;
            detectAudio?: boolean;
            enableStreamCapture?: boolean;
            canvas?: any;
            precision?: any;
            extendTransforms?: {};
        });
        pb: any;
        width: number;
        height: number;
        renderAll: boolean;
        detectAudio: boolean;
        synth: {
            time: number;
            bpm: number;
            width: number;
            height: number;
            fps: any;
            stats: {
                fps: number;
            };
            speed: number;
            mouse: {
                element: any;
            };
            render: any;
            setResolution: any;
            update: (dt: any) => void;
            hush: any;
            tick: any;
        };
        timeSinceLastUpdate: number;
        precision: any;
        extendTransforms: {};
        saveFrame: boolean;
        captureStream: any;
        generator: Generator;
        sandbox: Sandbox;
        eval(code: any): void;
        hush(): void;
        loadScript(url?: string): Promise<any>;
        setResolution(width: any, height: any): void;
        canvasToImage(callback: any): void;
        canvas: any;
        regl: any;
        renderFbo: any;
        o: any[];
        output: any;
        s: any[];
        createSource(i: any): Source;
        isRenderingAll: boolean;
        tick(dt: any, uniforms: any): void;
    }
}
