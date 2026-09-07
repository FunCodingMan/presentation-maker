import type { Slide } from './slide.js';

type Presentation = {
    id: string;
    name: string; 
    slides?: Slide[];
    active_slide_idx?: number;
}

export { 
    type Presentation 
}