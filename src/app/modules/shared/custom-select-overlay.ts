

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

/**
 * Extending the `@angular/cdk` overlay to add a custom class when it is used by the mat-select
 */

export class CustomSelectOverlay extends Overlay {

    private readonly OVERLAY_PANEL_CLASS = 'custom-overlay-panel';

    /**
     * Creates an overlay that will also add the custom overlay panel class to the overlay panel.
     */
    override create(config?: OverlayConfig): OverlayRef {
        // Add to existing config
        if (config && config.panelClass) {
            if (Array.isArray(config.panelClass)) {
                config.panelClass.push(this.OVERLAY_PANEL_CLASS);
            }
            else {
                config.panelClass = [config.panelClass, this.OVERLAY_PANEL_CLASS];
            }
        }
        else {
            // Create new config
            if (config) {
                config.panelClass = [this.OVERLAY_PANEL_CLASS];
            }
            else {
                config = { panelClass: [this.OVERLAY_PANEL_CLASS] };
            }
        }

        return super.create(config);
    }
}
