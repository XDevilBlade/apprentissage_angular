/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { NotifierAnimationService } from '../services/notifier-animation.service';
import { NotifierNotification } from '../models/notifier-notification.model';
import { NotifierService } from '../services/notifier.service';
import { NotifierTimerService } from '../services/notifier-timer.service';
/**
 * Notifier notification component
 * -------------------------------
 * This component is responsible for actually displaying the notification on screen. In addition, it's able to show and hide this
 * notification, in particular to animate this notification in and out, as well as shift (move) this notification vertically around.
 * Furthermore, the notification component handles all interactions the user has with this notification / component, such as clicks and
 * mouse movements.
 */
var NotifierNotificationComponent = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param elementRef               Reference to the component's element
     * @param renderer                 Angular renderer
     * @param notifierService          Notifier service
     * @param notifierTimerService     Notifier timer service
     * @param notifierAnimationService Notifier animation service
     */
    function NotifierNotificationComponent(elementRef, renderer, notifierService, notifierTimerService, notifierAnimationService) {
        this.config = notifierService.getConfig();
        this.ready = new EventEmitter();
        this.dismiss = new EventEmitter();
        this.timerService = notifierTimerService;
        this.animationService = notifierAnimationService;
        this.renderer = renderer;
        this.element = elementRef.nativeElement;
        this.elementShift = 0;
    }
    /**
     * Component after view init lifecycle hook, setts up the component and then emits the ready event
     */
    /**
     * Component after view init lifecycle hook, setts up the component and then emits the ready event
     * @return {?}
     */
    NotifierNotificationComponent.prototype.ngAfterViewInit = /**
     * Component after view init lifecycle hook, setts up the component and then emits the ready event
     * @return {?}
     */
    function () {
        this.setup();
        this.elementHeight = this.element.offsetHeight;
        this.elementWidth = this.element.offsetWidth;
        this.ready.emit(this);
    };
    /**
     * Get the notifier config
     *
     * @returns Notifier configuration
     */
    /**
     * Get the notifier config
     *
     * @return {?} Notifier configuration
     */
    NotifierNotificationComponent.prototype.getConfig = /**
     * Get the notifier config
     *
     * @return {?} Notifier configuration
     */
    function () {
        return this.config;
    };
    /**
     * Get notification element height (in px)
     *
     * @returns Notification element height (in px)
     */
    /**
     * Get notification element height (in px)
     *
     * @return {?} Notification element height (in px)
     */
    NotifierNotificationComponent.prototype.getHeight = /**
     * Get notification element height (in px)
     *
     * @return {?} Notification element height (in px)
     */
    function () {
        return this.elementHeight;
    };
    /**
     * Get notification element width (in px)
     *
     * @returns Notification element height (in px)
     */
    /**
     * Get notification element width (in px)
     *
     * @return {?} Notification element height (in px)
     */
    NotifierNotificationComponent.prototype.getWidth = /**
     * Get notification element width (in px)
     *
     * @return {?} Notification element height (in px)
     */
    function () {
        return this.elementWidth;
    };
    /**
     * Get notification shift offset (in px)
     *
     * @returns Notification element shift offset (in px)
     */
    /**
     * Get notification shift offset (in px)
     *
     * @return {?} Notification element shift offset (in px)
     */
    NotifierNotificationComponent.prototype.getShift = /**
     * Get notification shift offset (in px)
     *
     * @return {?} Notification element shift offset (in px)
     */
    function () {
        return this.elementShift;
    };
    /**
     * Show (animate in) this notification
     *
     * @returns Promise, resolved when done
     */
    /**
     * Show (animate in) this notification
     *
     * @return {?} Promise, resolved when done
     */
    NotifierNotificationComponent.prototype.show = /**
     * Show (animate in) this notification
     *
     * @return {?} Promise, resolved when done
     */
    function () {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            // Are animations enabled?
            if (_this.config.animations.enabled && _this.config.animations.show.speed > 0) {
                // Get animation data
                /** @type {?} */
                var animationData = _this.animationService.getAnimationData('show', _this.notification);
                // Set initial styles (styles before animation), prevents quick flicker when animation starts
                /** @type {?} */
                var animatedProperties = Object.keys(animationData.keyframes[0]);
                for (var i = animatedProperties.length - 1; i >= 0; i--) {
                    _this.renderer.setStyle(_this.element, animatedProperties[i], animationData.keyframes[0][animatedProperties[i]]);
                }
                // Animate notification in
                _this.renderer.setStyle(_this.element, 'visibility', 'visible');
                /** @type {?} */
                var animation = _this.element.animate(animationData.keyframes, animationData.options);
                animation.onfinish = (/**
                 * @return {?}
                 */
                function () {
                    _this.startAutoHideTimer();
                    resolve(); // Done
                });
            }
            else {
                // Show notification
                _this.renderer.setStyle(_this.element, 'visibility', 'visible');
                _this.startAutoHideTimer();
                resolve(); // Done
            }
        }));
    };
    /**
     * Hide (animate out) this notification
     *
     * @returns Promise, resolved when done
     */
    /**
     * Hide (animate out) this notification
     *
     * @return {?} Promise, resolved when done
     */
    NotifierNotificationComponent.prototype.hide = /**
     * Hide (animate out) this notification
     *
     * @return {?} Promise, resolved when done
     */
    function () {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.stopAutoHideTimer();
            // Are animations enabled?
            if (_this.config.animations.enabled && _this.config.animations.hide.speed > 0) {
                /** @type {?} */
                var animationData = _this.animationService.getAnimationData('hide', _this.notification);
                /** @type {?} */
                var animation = _this.element.animate(animationData.keyframes, animationData.options);
                animation.onfinish = (/**
                 * @return {?}
                 */
                function () {
                    resolve(); // Done
                });
            }
            else {
                resolve(); // Done
            }
        }));
    };
    /**
     * Shift (move) this notification
     *
     * @param   distance         Distance to shift (in px)
     * @param   shiftToMakePlace Flag, defining in which direction to shift
     * @returns Promise, resolved when done
     */
    /**
     * Shift (move) this notification
     *
     * @param {?} distance         Distance to shift (in px)
     * @param {?} shiftToMakePlace Flag, defining in which direction to shift
     * @return {?} Promise, resolved when done
     */
    NotifierNotificationComponent.prototype.shift = /**
     * Shift (move) this notification
     *
     * @param {?} distance         Distance to shift (in px)
     * @param {?} shiftToMakePlace Flag, defining in which direction to shift
     * @return {?} Promise, resolved when done
     */
    function (distance, shiftToMakePlace) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            // Calculate new position (position after the shift)
            /** @type {?} */
            var newElementShift;
            if ((_this.config.position.vertical.position === 'top' && shiftToMakePlace)
                || (_this.config.position.vertical.position === 'bottom' && !shiftToMakePlace)) {
                newElementShift = _this.elementShift + distance + _this.config.position.vertical.gap;
            }
            else {
                newElementShift = _this.elementShift - distance - _this.config.position.vertical.gap;
            }
            /** @type {?} */
            var horizontalPosition = _this.config.position.horizontal.position === 'middle' ? '-50%' : '0';
            // Are animations enabled?
            if (_this.config.animations.enabled && _this.config.animations.shift.speed > 0) {
                /** @type {?} */
                var animationData = {
                    // TODO: Extract into animation service
                    keyframes: [
                        {
                            transform: "translate3d( " + horizontalPosition + ", " + _this.elementShift + "px, 0 )"
                        },
                        {
                            transform: "translate3d( " + horizontalPosition + ", " + newElementShift + "px, 0 )"
                        }
                    ],
                    options: {
                        duration: _this.config.animations.shift.speed,
                        easing: _this.config.animations.shift.easing,
                        fill: 'forwards'
                    }
                };
                _this.elementShift = newElementShift;
                /** @type {?} */
                var animation = _this.element.animate(animationData.keyframes, animationData.options);
                animation.onfinish = (/**
                 * @return {?}
                 */
                function () {
                    resolve(); // Done
                });
            }
            else {
                _this.renderer.setStyle(_this.element, 'transform', "translate3d( " + horizontalPosition + ", " + newElementShift + "px, 0 )");
                _this.elementShift = newElementShift;
                resolve(); // Done
            }
        }));
    };
    /**
     * Handle click on dismiss button
     */
    /**
     * Handle click on dismiss button
     * @return {?}
     */
    NotifierNotificationComponent.prototype.onClickDismiss = /**
     * Handle click on dismiss button
     * @return {?}
     */
    function () {
        this.dismiss.emit(this.notification.id);
    };
    /**
     * Handle mouseover over notification area
     */
    /**
     * Handle mouseover over notification area
     * @return {?}
     */
    NotifierNotificationComponent.prototype.onNotificationMouseover = /**
     * Handle mouseover over notification area
     * @return {?}
     */
    function () {
        if (this.config.behaviour.onMouseover === 'pauseAutoHide') {
            this.pauseAutoHideTimer();
        }
        else if (this.config.behaviour.onMouseover === 'resetAutoHide') {
            this.stopAutoHideTimer();
        }
    };
    /**
     * Handle mouseout from notification area
     */
    /**
     * Handle mouseout from notification area
     * @return {?}
     */
    NotifierNotificationComponent.prototype.onNotificationMouseout = /**
     * Handle mouseout from notification area
     * @return {?}
     */
    function () {
        if (this.config.behaviour.onMouseover === 'pauseAutoHide') {
            this.continueAutoHideTimer();
        }
        else if (this.config.behaviour.onMouseover === 'resetAutoHide') {
            this.startAutoHideTimer();
        }
    };
    /**
     * Handle click on notification area
     */
    /**
     * Handle click on notification area
     * @return {?}
     */
    NotifierNotificationComponent.prototype.onNotificationClick = /**
     * Handle click on notification area
     * @return {?}
     */
    function () {
        if (this.config.behaviour.onClick === 'hide') {
            this.onClickDismiss();
        }
    };
    /**
     * Start the auto hide timer (if enabled)
     */
    /**
     * Start the auto hide timer (if enabled)
     * @private
     * @return {?}
     */
    NotifierNotificationComponent.prototype.startAutoHideTimer = /**
     * Start the auto hide timer (if enabled)
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.timerService.start(this.config.behaviour.autoHide).then((/**
             * @return {?}
             */
            function () {
                _this.onClickDismiss();
            }));
        }
    };
    /**
     * Pause the auto hide timer (if enabled)
     */
    /**
     * Pause the auto hide timer (if enabled)
     * @private
     * @return {?}
     */
    NotifierNotificationComponent.prototype.pauseAutoHideTimer = /**
     * Pause the auto hide timer (if enabled)
     * @private
     * @return {?}
     */
    function () {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.timerService.pause();
        }
    };
    /**
     * Continue the auto hide timer (if enabled)
     */
    /**
     * Continue the auto hide timer (if enabled)
     * @private
     * @return {?}
     */
    NotifierNotificationComponent.prototype.continueAutoHideTimer = /**
     * Continue the auto hide timer (if enabled)
     * @private
     * @return {?}
     */
    function () {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.timerService.continue();
        }
    };
    /**
     * Stop the auto hide timer (if enabled)
     */
    /**
     * Stop the auto hide timer (if enabled)
     * @private
     * @return {?}
     */
    NotifierNotificationComponent.prototype.stopAutoHideTimer = /**
     * Stop the auto hide timer (if enabled)
     * @private
     * @return {?}
     */
    function () {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.timerService.stop();
        }
    };
    /**
     * Initial notification setup
     */
    /**
     * Initial notification setup
     * @private
     * @return {?}
     */
    NotifierNotificationComponent.prototype.setup = /**
     * Initial notification setup
     * @private
     * @return {?}
     */
    function () {
        // Set start position (initially the exact same for every new notification)
        if (this.config.position.horizontal.position === 'left') {
            this.renderer.setStyle(this.element, 'left', this.config.position.horizontal.distance + "px");
        }
        else if (this.config.position.horizontal.position === 'right') {
            this.renderer.setStyle(this.element, 'right', this.config.position.horizontal.distance + "px");
        }
        else {
            this.renderer.setStyle(this.element, 'left', '50%');
            // Let's get the GPU handle some work as well (#perfmatters)
            this.renderer.setStyle(this.element, 'transform', 'translate3d( -50%, 0, 0 )');
        }
        if (this.config.position.vertical.position === 'top') {
            this.renderer.setStyle(this.element, 'top', this.config.position.vertical.distance + "px");
        }
        else {
            this.renderer.setStyle(this.element, 'bottom', this.config.position.vertical.distance + "px");
        }
        // Add classes (responsible for visual design)
        this.renderer.addClass(this.element, "notifier__notification--" + this.notification.type);
        this.renderer.addClass(this.element, "notifier__notification--" + this.config.theme);
    };
    NotifierNotificationComponent.decorators = [
        { type: Component, args: [{
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    // (#perfmatters)
                    host: {
                        '(click)': 'onNotificationClick()',
                        '(mouseout)': 'onNotificationMouseout()',
                        '(mouseover)': 'onNotificationMouseover()',
                        class: 'notifier__notification'
                    },
                    providers: [
                        // We provide the timer to the component's local injector, so that every notification components gets its own
                        // instance of the timer service, thus running their timers independently from each other
                        NotifierTimerService
                    ],
                    selector: 'notifier-notification',
                    template: "<ng-container *ngIf=\"notification.template; else predefinedNotification\" [ngTemplateOutlet]=\"notification.template\" [ngTemplateOutletContext]=\"{ notification: notification }\">\n</ng-container>\n\n<ng-template #predefinedNotification>\n\t<p class=\"notifier__notification-message\">{{ notification.message }}</p>\n\t<button class=\"notifier__notification-button\" type=\"button\" title=\"dismiss\" *ngIf=\"config.behaviour.showDismissButton\" (click)=\"onClickDismiss()\">\n\t\t<svg class=\"notifier__notification-button-icon\" viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">\n\t\t\t<path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\" />\n\t\t</svg>\n\t</button>\n</ng-template>\n"
                }] }
    ];
    /** @nocollapse */
    NotifierNotificationComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: NotifierService },
        { type: NotifierTimerService },
        { type: NotifierAnimationService }
    ]; };
    NotifierNotificationComponent.propDecorators = {
        notification: [{ type: Input }],
        ready: [{ type: Output }],
        dismiss: [{ type: Output }]
    };
    return NotifierNotificationComponent;
}());
export { NotifierNotificationComponent };
if (false) {
    /**
     * Input: Notification object, contains all details necessary to construct the notification
     * @type {?}
     */
    NotifierNotificationComponent.prototype.notification;
    /**
     * Output: Ready event, handles the initialization success by emitting a reference to this notification component
     * @type {?}
     */
    NotifierNotificationComponent.prototype.ready;
    /**
     * Output: Dismiss event, handles the click on the dismiss button by emitting the notification ID of this notification component
     * @type {?}
     */
    NotifierNotificationComponent.prototype.dismiss;
    /**
     * Notifier configuration
     * @type {?}
     */
    NotifierNotificationComponent.prototype.config;
    /**
     * Notifier timer service
     * @type {?}
     * @private
     */
    NotifierNotificationComponent.prototype.timerService;
    /**
     * Notifier animation service
     * @type {?}
     * @private
     */
    NotifierNotificationComponent.prototype.animationService;
    /**
     * Angular renderer, used to preserve the overall DOM abstraction & independence
     * @type {?}
     * @private
     */
    NotifierNotificationComponent.prototype.renderer;
    /**
     * Native element reference, used for manipulating DOM properties
     * @type {?}
     * @private
     */
    NotifierNotificationComponent.prototype.element;
    /**
     * Current notification height, calculated and cached here (#perfmatters)
     * @type {?}
     * @private
     */
    NotifierNotificationComponent.prototype.elementHeight;
    /**
     * Current notification width, calculated and cached here (#perfmatters)
     * @type {?}
     * @private
     */
    NotifierNotificationComponent.prototype.elementWidth;
    /**
     * Current notification shift, calculated and cached here (#perfmatters)
     * @type {?}
     * @private
     */
    NotifierNotificationComponent.prototype.elementShift;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXItbm90aWZpY2F0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItbm90aWZpZXIvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ub3RpZmllci1ub3RpZmljYXRpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQWlCLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3RJLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRWxGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQzs7Ozs7Ozs7O0FBVTFFO0lBNEVDOzs7Ozs7OztPQVFHO0lBQ0gsdUNBQW9CLFVBQXNCLEVBQUUsUUFBbUIsRUFBRSxlQUFnQyxFQUNoRyxvQkFBMEMsRUFBRSx3QkFBa0Q7UUFDOUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFlBQVksRUFBaUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDMUMsSUFBSSxDQUFDLFlBQVksR0FBRyxvQkFBb0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsd0JBQXdCLENBQUM7UUFDakQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxD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LDhDQUMwRDs7Ozs7SUFLMUQsZ0RBQ3FDOzs7OztJQUtyQywrQ0FBdUM7Ozs7OztJQUt2QyxxREFBb0Q7Ozs7OztJQUtwRCx5REFBNEQ7Ozs7OztJQUs1RCxpREFBcUM7Ozs7OztJQUtyQyxnREFBc0M7Ozs7OztJQUt0QyxzREFBOEI7Ozs7OztJQUs5QixxREFBNkI7Ozs7OztJQUs3QixxREFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBOb3RpZmllckFuaW1hdGlvbkRhdGEgfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpZXItYW5pbWF0aW9uLm1vZGVsJztcbmltcG9ydCB7IE5vdGlmaWVyQW5pbWF0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL25vdGlmaWVyLWFuaW1hdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IE5vdGlmaWVyQ29uZmlnIH0gZnJvbSAnLi4vbW9kZWxzL25vdGlmaWVyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQgeyBOb3RpZmllck5vdGlmaWNhdGlvbiB9IGZyb20gJy4uL21vZGVscy9ub3RpZmllci1ub3RpZmljYXRpb24ubW9kZWwnO1xuaW1wb3J0IHsgTm90aWZpZXJTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbm90aWZpZXIuc2VydmljZSc7XG5pbXBvcnQgeyBOb3RpZmllclRpbWVyU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL25vdGlmaWVyLXRpbWVyLnNlcnZpY2UnO1xuXG4vKipcbiAqIE5vdGlmaWVyIG5vdGlmaWNhdGlvbiBjb21wb25lbnRcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFRoaXMgY29tcG9uZW50IGlzIHJlc3BvbnNpYmxlIGZvciBhY3R1YWxseSBkaXNwbGF5aW5nIHRoZSBub3RpZmljYXRpb24gb24gc2NyZWVuLiBJbiBhZGRpdGlvbiwgaXQncyBhYmxlIHRvIHNob3cgYW5kIGhpZGUgdGhpc1xuICogbm90aWZpY2F0aW9uLCBpbiBwYXJ0aWN1bGFyIHRvIGFuaW1hdGUgdGhpcyBub3RpZmljYXRpb24gaW4gYW5kIG91dCwgYXMgd2VsbCBhcyBzaGlmdCAobW92ZSkgdGhpcyBub3RpZmljYXRpb24gdmVydGljYWxseSBhcm91bmQuXG4gKiBGdXJ0aGVybW9yZSwgdGhlIG5vdGlmaWNhdGlvbiBjb21wb25lbnQgaGFuZGxlcyBhbGwgaW50ZXJhY3Rpb25zIHRoZSB1c2VyIGhhcyB3aXRoIHRoaXMgbm90aWZpY2F0aW9uIC8gY29tcG9uZW50LCBzdWNoIGFzIGNsaWNrcyBhbmRcbiAqIG1vdXNlIG1vdmVtZW50cy5cbiAqL1xuQENvbXBvbmVudCgge1xuXHRjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgLy8gKCNwZXJmbWF0dGVycylcblx0aG9zdDoge1xuXHRcdCcoY2xpY2spJzogJ29uTm90aWZpY2F0aW9uQ2xpY2soKScsXG5cdFx0Jyhtb3VzZW91dCknOiAnb25Ob3RpZmljYXRpb25Nb3VzZW91dCgpJyxcblx0XHQnKG1vdXNlb3ZlciknOiAnb25Ob3RpZmljYXRpb25Nb3VzZW92ZXIoKScsXG5cdFx0Y2xhc3M6ICdub3RpZmllcl9fbm90aWZpY2F0aW9uJ1xuXHR9LFxuXHRwcm92aWRlcnM6IFtcblx0XHQvLyBXZSBwcm92aWRlIHRoZSB0aW1lciB0byB0aGUgY29tcG9uZW50J3MgbG9jYWwgaW5qZWN0b3IsIHNvIHRoYXQgZXZlcnkgbm90aWZpY2F0aW9uIGNvbXBvbmVudHMgZ2V0cyBpdHMgb3duXG5cdFx0Ly8gaW5zdGFuY2Ugb2YgdGhlIHRpbWVyIHNlcnZpY2UsIHRodXMgcnVubmluZyB0aGVpciB0aW1lcnMgaW5kZXBlbmRlbnRseSBmcm9tIGVhY2ggb3RoZXJcblx0XHROb3RpZmllclRpbWVyU2VydmljZVxuXHRdLFxuXHRzZWxlY3RvcjogJ25vdGlmaWVyLW5vdGlmaWNhdGlvbicsXG5cdHRlbXBsYXRlVXJsOiAnLi9ub3RpZmllci1ub3RpZmljYXRpb24uY29tcG9uZW50Lmh0bWwnXG59IClcbmV4cG9ydCBjbGFzcyBOb3RpZmllck5vdGlmaWNhdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG5cdC8qKlxuXHQgKiBJbnB1dDogTm90aWZpY2F0aW9uIG9iamVjdCwgY29udGFpbnMgYWxsIGRldGFpbHMgbmVjZXNzYXJ5IHRvIGNvbnN0cnVjdCB0aGUgbm90aWZpY2F0aW9uXG5cdCAqL1xuXHRASW5wdXQoKVxuXHRwdWJsaWMgbm90aWZpY2F0aW9uOiBOb3RpZmllck5vdGlmaWNhdGlvbjtcblxuXHQvKipcblx0ICogT3V0cHV0OiBSZWFkeSBldmVudCwgaGFuZGxlcyB0aGUgaW5pdGlhbGl6YXRpb24gc3VjY2VzcyBieSBlbWl0dGluZyBhIHJlZmVyZW5jZSB0byB0aGlzIG5vdGlmaWNhdGlvbiBjb21wb25lbnRcblx0ICovXG5cdEBPdXRwdXQoKVxuXHRwdWJsaWMgcmVhZHk6IEV2ZW50RW1pdHRlcjxOb3RpZmllck5vdGlmaWNhdGlvbkNvbXBvbmVudD47XG5cblx0LyoqXG5cdCAqIE91dHB1dDogRGlzbWlzcyBldmVudCwgaGFuZGxlcyB0aGUgY2xpY2sgb24gdGhlIGRpc21pc3MgYnV0dG9uIGJ5IGVtaXR0aW5nIHRoZSBub3RpZmljYXRpb24gSUQgb2YgdGhpcyBub3RpZmljYXRpb24gY29tcG9uZW50XG5cdCAqL1xuXHRAT3V0cHV0KClcblx0cHVibGljIGRpc21pc3M6IEV2ZW50RW1pdHRlcjxzdHJpbmc+O1xuXG5cdC8qKlxuXHQgKiBOb3RpZmllciBjb25maWd1cmF0aW9uXG5cdCAqL1xuXHRwdWJsaWMgcmVhZG9ubHkgY29uZmlnOiBOb3RpZmllckNvbmZpZztcblxuXHQvKipcblx0ICogTm90aWZpZXIgdGltZXIgc2VydmljZVxuXHQgKi9cblx0cHJpdmF0ZSByZWFkb25seSB0aW1lclNlcnZpY2U6IE5vdGlmaWVyVGltZXJTZXJ2aWNlO1xuXG5cdC8qKlxuXHQgKiBOb3RpZmllciBhbmltYXRpb24gc2VydmljZVxuXHQgKi9cblx0cHJpdmF0ZSByZWFkb25seSBhbmltYXRpb25TZXJ2aWNlOiBOb3RpZmllckFuaW1hdGlvblNlcnZpY2U7XG5cblx0LyoqXG5cdCAqIEFuZ3VsYXIgcmVuZGVyZXIsIHVzZWQgdG8gcHJlc2VydmUgdGhlIG92ZXJhbGwgRE9NIGFic3RyYWN0aW9uICYgaW5kZXBlbmRlbmNlXG5cdCAqL1xuXHRwcml2YXRlIHJlYWRvbmx5IHJlbmRlcmVyOiBSZW5kZXJlcjI7XG5cblx0LyoqXG5cdCAqIE5hdGl2ZSBlbGVtZW50IHJlZmVyZW5jZSwgdXNlZCBmb3IgbWFuaXB1bGF0aW5nIERPTSBwcm9wZXJ0aWVzXG5cdCAqL1xuXHRwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG5cdC8qKlxuXHQgKiBDdXJyZW50IG5vdGlmaWNhdGlvbiBoZWlnaHQsIGNhbGN1bGF0ZWQgYW5kIGNhY2hlZCBoZXJlICgjcGVyZm1hdHRlcnMpXG5cdCAqL1xuXHRwcml2YXRlIGVsZW1lbnRIZWlnaHQ6IG51bWJlcjtcblxuXHQvKipcblx0ICogQ3VycmVudCBub3RpZmljYXRpb24gd2lkdGgsIGNhbGN1bGF0ZWQgYW5kIGNhY2hlZCBoZXJlICgjcGVyZm1hdHRlcnMpXG5cdCAqL1xuXHRwcml2YXRlIGVsZW1lbnRXaWR0aDogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBDdXJyZW50IG5vdGlmaWNhdGlvbiBzaGlmdCwgY2FsY3VsYXRlZCBhbmQgY2FjaGVkIGhlcmUgKCNwZXJmbWF0dGVycylcblx0ICovXG5cdHByaXZhdGUgZWxlbWVudFNoaWZ0OiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIENvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSBlbGVtZW50UmVmICAgICAgICAgICAgICAgUmVmZXJlbmNlIHRvIHRoZSBjb21wb25lbnQncyBlbGVtZW50XG5cdCAqIEBwYXJhbSByZW5kZXJlciAgICAgICAgICAgICAgICAgQW5ndWxhciByZW5kZXJlclxuXHQgKiBAcGFyYW0gbm90aWZpZXJTZXJ2aWNlICAgICAgICAgIE5vdGlmaWVyIHNlcnZpY2Vcblx0ICogQHBhcmFtIG5vdGlmaWVyVGltZXJTZXJ2aWNlICAgICBOb3RpZmllciB0aW1lciBzZXJ2aWNlXG5cdCAqIEBwYXJhbSBub3RpZmllckFuaW1hdGlvblNlcnZpY2UgTm90aWZpZXIgYW5pbWF0aW9uIHNlcnZpY2Vcblx0ICovXG5cdHB1YmxpYyBjb25zdHJ1Y3RvciggZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcmVuZGVyZXI6IFJlbmRlcmVyMiwgbm90aWZpZXJTZXJ2aWNlOiBOb3RpZmllclNlcnZpY2UsXG5cdFx0bm90aWZpZXJUaW1lclNlcnZpY2U6IE5vdGlmaWVyVGltZXJTZXJ2aWNlLCBub3RpZmllckFuaW1hdGlvblNlcnZpY2U6IE5vdGlmaWVyQW5pbWF0aW9uU2VydmljZSApIHtcblx0XHR0aGlzLmNvbmZpZyA9IG5vdGlmaWVyU2VydmljZS5nZXRDb25maWcoKTtcblx0XHR0aGlzLnJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxOb3RpZmllck5vdGlmaWNhdGlvbkNvbXBvbmVudD4oKTtcblx0XHR0aGlzLmRpc21pc3MgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblx0XHR0aGlzLnRpbWVyU2VydmljZSA9IG5vdGlmaWVyVGltZXJTZXJ2aWNlO1xuXHRcdHRoaXMuYW5pbWF0aW9uU2VydmljZSA9IG5vdGlmaWVyQW5pbWF0aW9uU2VydmljZTtcblx0XHR0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG5cdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXHRcdHRoaXMuZWxlbWVudFNoaWZ0ID0gMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb21wb25lbnQgYWZ0ZXIgdmlldyBpbml0IGxpZmVjeWNsZSBob29rLCBzZXR0cyB1cCB0aGUgY29tcG9uZW50IGFuZCB0aGVuIGVtaXRzIHRoZSByZWFkeSBldmVudFxuXHQgKi9cblx0cHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcblx0XHR0aGlzLnNldHVwKCk7XG5cdFx0dGhpcy5lbGVtZW50SGVpZ2h0ID0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodDtcblx0XHR0aGlzLmVsZW1lbnRXaWR0aCA9IHRoaXMuZWxlbWVudC5vZmZzZXRXaWR0aDtcblx0XHR0aGlzLnJlYWR5LmVtaXQoIHRoaXMgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIG5vdGlmaWVyIGNvbmZpZ1xuXHQgKlxuXHQgKiBAcmV0dXJucyBOb3RpZmllciBjb25maWd1cmF0aW9uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0Q29uZmlnKCk6IE5vdGlmaWVyQ29uZmlnIHtcblx0XHRyZXR1cm4gdGhpcy5jb25maWc7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IG5vdGlmaWNhdGlvbiBlbGVtZW50IGhlaWdodCAoaW4gcHgpXG5cdCAqXG5cdCAqIEByZXR1cm5zIE5vdGlmaWNhdGlvbiBlbGVtZW50IGhlaWdodCAoaW4gcHgpXG5cdCAqL1xuXHRwdWJsaWMgZ2V0SGVpZ2h0KCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudEhlaWdodDtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgbm90aWZpY2F0aW9uIGVsZW1lbnQgd2lkdGggKGluIHB4KVxuXHQgKlxuXHQgKiBAcmV0dXJucyBOb3RpZmljYXRpb24gZWxlbWVudCBoZWlnaHQgKGluIHB4KVxuXHQgKi9cblx0cHVibGljIGdldFdpZHRoKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudFdpZHRoO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCBub3RpZmljYXRpb24gc2hpZnQgb2Zmc2V0IChpbiBweClcblx0ICpcblx0ICogQHJldHVybnMgTm90aWZpY2F0aW9uIGVsZW1lbnQgc2hpZnQgb2Zmc2V0IChpbiBweClcblx0ICovXG5cdHB1YmxpYyBnZXRTaGlmdCgpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLmVsZW1lbnRTaGlmdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBTaG93IChhbmltYXRlIGluKSB0aGlzIG5vdGlmaWNhdGlvblxuXHQgKlxuXHQgKiBAcmV0dXJucyBQcm9taXNlLCByZXNvbHZlZCB3aGVuIGRvbmVcblx0ICovXG5cdHB1YmxpYyBzaG93KCk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlPHVuZGVmaW5lZD4oICggcmVzb2x2ZTogKCkgPT4gdm9pZCwgcmVqZWN0OiAoKSA9PiB2b2lkICkgPT4ge1xuXG5cdFx0XHQvLyBBcmUgYW5pbWF0aW9ucyBlbmFibGVkP1xuXHRcdFx0aWYgKCB0aGlzLmNvbmZpZy5hbmltYXRpb25zLmVuYWJsZWQgJiYgdGhpcy5jb25maWcuYW5pbWF0aW9ucy5zaG93LnNwZWVkID4gMCApIHtcblxuXHRcdFx0XHQvLyBHZXQgYW5pbWF0aW9uIGRhdGFcblx0XHRcdFx0Y29uc3QgYW5pbWF0aW9uRGF0YTogTm90aWZpZXJBbmltYXRpb25EYXRhID0gdGhpcy5hbmltYXRpb25TZXJ2aWNlLmdldEFuaW1hdGlvbkRhdGEoICdzaG93JywgdGhpcy5ub3RpZmljYXRpb24gKTtcblxuXHRcdFx0XHQvLyBTZXQgaW5pdGlhbCBzdHlsZXMgKHN0eWxlcyBiZWZvcmUgYW5pbWF0aW9uKSwgcHJldmVudHMgcXVpY2sgZmxpY2tlciB3aGVuIGFuaW1hdGlvbiBzdGFydHNcblx0XHRcdFx0Y29uc3QgYW5pbWF0ZWRQcm9wZXJ0aWVzOiBBcnJheTxzdHJpbmc+ID0gT2JqZWN0LmtleXMoIGFuaW1hdGlvbkRhdGEua2V5ZnJhbWVzWyAwIF0gKTtcblx0XHRcdFx0Zm9yICggbGV0IGk6IG51bWJlciA9IGFuaW1hdGVkUHJvcGVydGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSApIHtcblx0XHRcdFx0XHR0aGlzLnJlbmRlcmVyLnNldFN0eWxlKCB0aGlzLmVsZW1lbnQsIGFuaW1hdGVkUHJvcGVydGllc1sgaSBdLFxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uRGF0YS5rZXlmcmFtZXNbIDAgXVsgYW5pbWF0ZWRQcm9wZXJ0aWVzWyBpIF0gXSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQW5pbWF0ZSBub3RpZmljYXRpb24gaW5cblx0XHRcdFx0dGhpcy5yZW5kZXJlci5zZXRTdHlsZSggdGhpcy5lbGVtZW50LCAndmlzaWJpbGl0eScsICd2aXNpYmxlJyApO1xuXHRcdFx0XHRjb25zdCBhbmltYXRpb246IEFuaW1hdGlvbiA9IHRoaXMuZWxlbWVudC5hbmltYXRlKCBhbmltYXRpb25EYXRhLmtleWZyYW1lcywgYW5pbWF0aW9uRGF0YS5vcHRpb25zICk7XG5cdFx0XHRcdGFuaW1hdGlvbi5vbmZpbmlzaCA9ICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLnN0YXJ0QXV0b0hpZGVUaW1lcigpO1xuXHRcdFx0XHRcdHJlc29sdmUoKTsgLy8gRG9uZVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFNob3cgbm90aWZpY2F0aW9uXG5cdFx0XHRcdHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoIHRoaXMuZWxlbWVudCwgJ3Zpc2liaWxpdHknLCAndmlzaWJsZScgKTtcblx0XHRcdFx0dGhpcy5zdGFydEF1dG9IaWRlVGltZXIoKTtcblx0XHRcdFx0cmVzb2x2ZSgpOyAvLyBEb25lXG5cblx0XHRcdH1cblxuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEhpZGUgKGFuaW1hdGUgb3V0KSB0aGlzIG5vdGlmaWNhdGlvblxuXHQgKlxuXHQgKiBAcmV0dXJucyBQcm9taXNlLCByZXNvbHZlZCB3aGVuIGRvbmVcblx0ICovXG5cdHB1YmxpYyBoaWRlKCk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlPHVuZGVmaW5lZD4oICggcmVzb2x2ZTogKCkgPT4gdm9pZCwgcmVqZWN0OiAoKSA9PiB2b2lkICkgPT4ge1xuXG5cdFx0XHR0aGlzLnN0b3BBdXRvSGlkZVRpbWVyKCk7XG5cblx0XHRcdC8vIEFyZSBhbmltYXRpb25zIGVuYWJsZWQ/XG5cdFx0XHRpZiAoIHRoaXMuY29uZmlnLmFuaW1hdGlvbnMuZW5hYmxlZCAmJiB0aGlzLmNvbmZpZy5hbmltYXRpb25zLmhpZGUuc3BlZWQgPiAwICkge1xuXHRcdFx0XHRjb25zdCBhbmltYXRpb25EYXRhOiBOb3RpZmllckFuaW1hdGlvbkRhdGEgPSB0aGlzLmFuaW1hdGlvblNlcnZpY2UuZ2V0QW5pbWF0aW9uRGF0YSggJ2hpZGUnLCB0aGlzLm5vdGlmaWNhdGlvbiApO1xuXHRcdFx0XHRjb25zdCBhbmltYXRpb246IEFuaW1hdGlvbiA9IHRoaXMuZWxlbWVudC5hbmltYXRlKCBhbmltYXRpb25EYXRhLmtleWZyYW1lcywgYW5pbWF0aW9uRGF0YS5vcHRpb25zICk7XG5cdFx0XHRcdGFuaW1hdGlvbi5vbmZpbmlzaCA9ICgpID0+IHtcblx0XHRcdFx0XHRyZXNvbHZlKCk7IC8vIERvbmVcblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc29sdmUoKTsgLy8gRG9uZVxuXHRcdFx0fVxuXG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNoaWZ0IChtb3ZlKSB0aGlzIG5vdGlmaWNhdGlvblxuXHQgKlxuXHQgKiBAcGFyYW0gICBkaXN0YW5jZSAgICAgICAgIERpc3RhbmNlIHRvIHNoaWZ0IChpbiBweClcblx0ICogQHBhcmFtICAgc2hpZnRUb01ha2VQbGFjZSBGbGFnLCBkZWZpbmluZyBpbiB3aGljaCBkaXJlY3Rpb24gdG8gc2hpZnRcblx0ICogQHJldHVybnMgUHJvbWlzZSwgcmVzb2x2ZWQgd2hlbiBkb25lXG5cdCAqL1xuXHRwdWJsaWMgc2hpZnQoIGRpc3RhbmNlOiBudW1iZXIsIHNoaWZ0VG9NYWtlUGxhY2U6IGJvb2xlYW4gKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2U8dW5kZWZpbmVkPiggKCByZXNvbHZlOiAoKSA9PiB2b2lkLCByZWplY3Q6ICgpID0+IHZvaWQgKSA9PiB7XG5cblx0XHRcdC8vIENhbGN1bGF0ZSBuZXcgcG9zaXRpb24gKHBvc2l0aW9uIGFmdGVyIHRoZSBzaGlmdClcblx0XHRcdGxldCBuZXdFbGVtZW50U2hpZnQ6IG51bWJlcjtcblx0XHRcdGlmICggKCB0aGlzLmNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5wb3NpdGlvbiA9PT0gJ3RvcCcgJiYgc2hpZnRUb01ha2VQbGFjZSApXG5cdFx0XHRcdHx8ICggdGhpcy5jb25maWcucG9zaXRpb24udmVydGljYWwucG9zaXRpb24gPT09ICdib3R0b20nICYmICFzaGlmdFRvTWFrZVBsYWNlICkgKSB7XG5cdFx0XHRcdG5ld0VsZW1lbnRTaGlmdCA9IHRoaXMuZWxlbWVudFNoaWZ0ICsgZGlzdGFuY2UgKyB0aGlzLmNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5nYXA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXdFbGVtZW50U2hpZnQgPSB0aGlzLmVsZW1lbnRTaGlmdCAtIGRpc3RhbmNlIC0gdGhpcy5jb25maWcucG9zaXRpb24udmVydGljYWwuZ2FwO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgaG9yaXpvbnRhbFBvc2l0aW9uOiBzdHJpbmcgPSB0aGlzLmNvbmZpZy5wb3NpdGlvbi5ob3Jpem9udGFsLnBvc2l0aW9uID09PSAnbWlkZGxlJyA/ICctNTAlJyA6ICcwJztcblxuXHRcdFx0Ly8gQXJlIGFuaW1hdGlvbnMgZW5hYmxlZD9cblx0XHRcdGlmICggdGhpcy5jb25maWcuYW5pbWF0aW9ucy5lbmFibGVkICYmIHRoaXMuY29uZmlnLmFuaW1hdGlvbnMuc2hpZnQuc3BlZWQgPiAwICkge1xuXHRcdFx0XHRjb25zdCBhbmltYXRpb25EYXRhOiBOb3RpZmllckFuaW1hdGlvbkRhdGEgPSB7IC8vIFRPRE86IEV4dHJhY3QgaW50byBhbmltYXRpb24gc2VydmljZVxuXHRcdFx0XHRcdGtleWZyYW1lczogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0cmFuc2Zvcm06IGB0cmFuc2xhdGUzZCggJHsgaG9yaXpvbnRhbFBvc2l0aW9uIH0sICR7IHRoaXMuZWxlbWVudFNoaWZ0IH1weCwgMCApYFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dHJhbnNmb3JtOiBgdHJhbnNsYXRlM2QoICR7IGhvcml6b250YWxQb3NpdGlvbiB9LCAkeyBuZXdFbGVtZW50U2hpZnQgfXB4LCAwIClgXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRkdXJhdGlvbjogdGhpcy5jb25maWcuYW5pbWF0aW9ucy5zaGlmdC5zcGVlZCxcblx0XHRcdFx0XHRcdGVhc2luZzogdGhpcy5jb25maWcuYW5pbWF0aW9ucy5zaGlmdC5lYXNpbmcsXG5cdFx0XHRcdFx0XHRmaWxsOiAnZm9yd2FyZHMnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRTaGlmdCA9IG5ld0VsZW1lbnRTaGlmdDtcblx0XHRcdFx0Y29uc3QgYW5pbWF0aW9uOiBBbmltYXRpb24gPSB0aGlzLmVsZW1lbnQuYW5pbWF0ZSggYW5pbWF0aW9uRGF0YS5rZXlmcmFtZXMsIGFuaW1hdGlvbkRhdGEub3B0aW9ucyApO1xuXHRcdFx0XHRhbmltYXRpb24ub25maW5pc2ggPSAoKSA9PiB7XG5cdFx0XHRcdFx0cmVzb2x2ZSgpOyAvLyBEb25lXG5cdFx0XHRcdH07XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoIHRoaXMuZWxlbWVudCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUzZCggJHsgaG9yaXpvbnRhbFBvc2l0aW9uIH0sICR7IG5ld0VsZW1lbnRTaGlmdCB9cHgsIDAgKWAgKTtcblx0XHRcdFx0dGhpcy5lbGVtZW50U2hpZnQgPSBuZXdFbGVtZW50U2hpZnQ7XG5cdFx0XHRcdHJlc29sdmUoKTsgLy8gRG9uZVxuXHRcdFx0fVxuXG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlIGNsaWNrIG9uIGRpc21pc3MgYnV0dG9uXG5cdCAqL1xuXHRwdWJsaWMgb25DbGlja0Rpc21pc3MoKTogdm9pZCB7XG5cdFx0dGhpcy5kaXNtaXNzLmVtaXQoIHRoaXMubm90aWZpY2F0aW9uLmlkICk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlIG1vdXNlb3ZlciBvdmVyIG5vdGlmaWNhdGlvbiBhcmVhXG5cdCAqL1xuXHRwdWJsaWMgb25Ob3RpZmljYXRpb25Nb3VzZW92ZXIoKTogdm9pZCB7XG5cdFx0aWYgKCB0aGlzLmNvbmZpZy5iZWhhdmlvdXIub25Nb3VzZW92ZXIgPT09ICdwYXVzZUF1dG9IaWRlJyApIHtcblx0XHRcdHRoaXMucGF1c2VBdXRvSGlkZVRpbWVyKCk7XG5cdFx0fSBlbHNlIGlmICggdGhpcy5jb25maWcuYmVoYXZpb3VyLm9uTW91c2VvdmVyID09PSAncmVzZXRBdXRvSGlkZScgKSB7XG5cdFx0XHR0aGlzLnN0b3BBdXRvSGlkZVRpbWVyKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZSBtb3VzZW91dCBmcm9tIG5vdGlmaWNhdGlvbiBhcmVhXG5cdCAqL1xuXHRwdWJsaWMgb25Ob3RpZmljYXRpb25Nb3VzZW91dCgpOiB2b2lkIHtcblx0XHRpZiAoIHRoaXMuY29uZmlnLmJlaGF2aW91ci5vbk1vdXNlb3ZlciA9PT0gJ3BhdXNlQXV0b0hpZGUnICkge1xuXHRcdFx0dGhpcy5jb250aW51ZUF1dG9IaWRlVGltZXIoKTtcblx0XHR9IGVsc2UgaWYgKCB0aGlzLmNvbmZpZy5iZWhhdmlvdXIub25Nb3VzZW92ZXIgPT09ICdyZXNldEF1dG9IaWRlJyApIHtcblx0XHRcdHRoaXMuc3RhcnRBdXRvSGlkZVRpbWVyKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZSBjbGljayBvbiBub3RpZmljYXRpb24gYXJlYVxuXHQgKi9cblx0cHVibGljIG9uTm90aWZpY2F0aW9uQ2xpY2soKTogdm9pZCB7XG5cdFx0aWYgKCB0aGlzLmNvbmZpZy5iZWhhdmlvdXIub25DbGljayA9PT0gJ2hpZGUnICkge1xuXHRcdFx0dGhpcy5vbkNsaWNrRGlzbWlzcygpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTdGFydCB0aGUgYXV0byBoaWRlIHRpbWVyIChpZiBlbmFibGVkKVxuXHQgKi9cblx0cHJpdmF0ZSBzdGFydEF1dG9IaWRlVGltZXIoKTogdm9pZCB7XG5cdFx0aWYgKCB0aGlzLmNvbmZpZy5iZWhhdmlvdXIuYXV0b0hpZGUgIT09IGZhbHNlICYmIHRoaXMuY29uZmlnLmJlaGF2aW91ci5hdXRvSGlkZSA+IDAgKSB7XG5cdFx0XHR0aGlzLnRpbWVyU2VydmljZS5zdGFydCggdGhpcy5jb25maWcuYmVoYXZpb3VyLmF1dG9IaWRlICkudGhlbiggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLm9uQ2xpY2tEaXNtaXNzKCk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFBhdXNlIHRoZSBhdXRvIGhpZGUgdGltZXIgKGlmIGVuYWJsZWQpXG5cdCAqL1xuXHRwcml2YXRlIHBhdXNlQXV0b0hpZGVUaW1lcigpOiB2b2lkIHtcblx0XHRpZiAoIHRoaXMuY29uZmlnLmJlaGF2aW91ci5hdXRvSGlkZSAhPT0gZmFsc2UgJiYgdGhpcy5jb25maWcuYmVoYXZpb3VyLmF1dG9IaWRlID4gMCApIHtcblx0XHRcdHRoaXMudGltZXJTZXJ2aWNlLnBhdXNlKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnRpbnVlIHRoZSBhdXRvIGhpZGUgdGltZXIgKGlmIGVuYWJsZWQpXG5cdCAqL1xuXHRwcml2YXRlIGNvbnRpbnVlQXV0b0hpZGVUaW1lcigpOiB2b2lkIHtcblx0XHRpZiAoIHRoaXMuY29uZmlnLmJlaGF2aW91ci5hdXRvSGlkZSAhPT0gZmFsc2UgJiYgdGhpcy5jb25maWcuYmVoYXZpb3VyLmF1dG9IaWRlID4gMCApIHtcblx0XHRcdHRoaXMudGltZXJTZXJ2aWNlLmNvbnRpbnVlKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFN0b3AgdGhlIGF1dG8gaGlkZSB0aW1lciAoaWYgZW5hYmxlZClcblx0ICovXG5cdHByaXZhdGUgc3RvcEF1dG9IaWRlVGltZXIoKTogdm9pZCB7XG5cdFx0aWYgKCB0aGlzLmNvbmZpZy5iZWhhdmlvdXIuYXV0b0hpZGUgIT09IGZhbHNlICYmIHRoaXMuY29uZmlnLmJlaGF2aW91ci5hdXRvSGlkZSA+IDAgKSB7XG5cdFx0XHR0aGlzLnRpbWVyU2VydmljZS5zdG9wKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWwgbm90aWZpY2F0aW9uIHNldHVwXG5cdCAqL1xuXHRwcml2YXRlIHNldHVwKCk6IHZvaWQge1xuXG5cdFx0Ly8gU2V0IHN0YXJ0IHBvc2l0aW9uIChpbml0aWFsbHkgdGhlIGV4YWN0IHNhbWUgZm9yIGV2ZXJ5IG5ldyBub3RpZmljYXRpb24pXG5cdFx0aWYgKCB0aGlzLmNvbmZpZy5wb3NpdGlvbi5ob3Jpem9udGFsLnBvc2l0aW9uID09PSAnbGVmdCcgKSB7XG5cdFx0XHR0aGlzLnJlbmRlcmVyLnNldFN0eWxlKCB0aGlzLmVsZW1lbnQsICdsZWZ0JywgYCR7IHRoaXMuY29uZmlnLnBvc2l0aW9uLmhvcml6b250YWwuZGlzdGFuY2UgfXB4YCApO1xuXHRcdH0gZWxzZSBpZiAoIHRoaXMuY29uZmlnLnBvc2l0aW9uLmhvcml6b250YWwucG9zaXRpb24gPT09ICdyaWdodCcgKSB7XG5cdFx0XHR0aGlzLnJlbmRlcmVyLnNldFN0eWxlKCB0aGlzLmVsZW1lbnQsICdyaWdodCcsIGAkeyB0aGlzLmNvbmZpZy5wb3NpdGlvbi5ob3Jpem9udGFsLmRpc3RhbmNlIH1weGAgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5yZW5kZXJlci5zZXRTdHlsZSggdGhpcy5lbGVtZW50LCAnbGVmdCcsICc1MCUnICk7XG5cdFx0XHQvLyBMZXQncyBnZXQgdGhlIEdQVSBoYW5kbGUgc29tZSB3b3JrIGFzIHdlbGwgKCNwZXJmbWF0dGVycylcblx0XHRcdHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoIHRoaXMuZWxlbWVudCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUzZCggLTUwJSwgMCwgMCApJyApO1xuXHRcdH1cblx0XHRpZiAoIHRoaXMuY29uZmlnLnBvc2l0aW9uLnZlcnRpY2FsLnBvc2l0aW9uID09PSAndG9wJyApIHtcblx0XHRcdHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoIHRoaXMuZWxlbWVudCwgJ3RvcCcsIGAkeyB0aGlzLmNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5kaXN0YW5jZSB9cHhgICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoIHRoaXMuZWxlbWVudCwgJ2JvdHRvbScsIGAkeyB0aGlzLmNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5kaXN0YW5jZSB9cHhgICk7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIGNsYXNzZXMgKHJlc3BvbnNpYmxlIGZvciB2aXN1YWwgZGVzaWduKVxuXHRcdHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoIHRoaXMuZWxlbWVudCwgYG5vdGlmaWVyX19ub3RpZmljYXRpb24tLSR7IHRoaXMubm90aWZpY2F0aW9uLnR5cGUgfWAgKTtcblx0XHR0aGlzLnJlbmRlcmVyLmFkZENsYXNzKCB0aGlzLmVsZW1lbnQsIGBub3RpZmllcl9fbm90aWZpY2F0aW9uLS0keyB0aGlzLmNvbmZpZy50aGVtZSB9YCApO1xuXG5cdH1cblxufVxuIl19