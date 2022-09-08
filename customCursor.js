function startCustomCursor(interactionSelector = '', sticky=true) {
    //don't do anything on touch screens
    if(!(( 'ontouchstart' in window ) || ( navigator.maxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 ))) {
        //Select elements
        const cursorContainer = document.querySelector('.has-custom-cursor');
        const cursorElement = document.getElementById('custom-cursor');
        const cursorElementRect = cursorElement.getBoundingClientRect();
        const buttonsQuery = interactionSelector.split(',').map((i) => i = '.has-custom-cursor ' + i.trim()).join(', ');
        const buttons = document.querySelectorAll(buttonsQuery);

        Array.from(buttons).some((btn) => {
            //Prep for animation: adding 'will-change: transform' improves animation performance
            btn.style.willChange = 'transform';
            
            //reset animation when the mouse leaves
            btn.onmouseleave = () => btn.style.transform = '';
            
            //click animation
            btn.onmousedown = () => btn.style.transform = btn.style.transform + ` scale(0.95)`;
            btn.onmouseup = () => btn.style.transform = btn.style.transform.replace(` scale(0.95)`, '');
        });

        //Get CSS options
        const cursorSize = parseInt(getComputedStyle(cursorContainer).getPropertyValue('--cursor-size'));
        const cursorInteractionPadding = parseInt(getComputedStyle(cursorContainer).getPropertyValue('--cursor-interaction-padding'));
        const cursorBorderWidth = parseInt(getComputedStyle(cursorContainer).getPropertyValue('--cursor-border-width'));

        //Cursor Options
        const cursorOptions = {
            cursorElement: cursorElement,
            cursorPositionOffset: cursorElementRect.height / 2,
            cursorSize: cursorSize,
            cursorInteractionPadding: cursorInteractionPadding,
            cursorInteractionBuffer: (cursorSize / 2) + cursorBorderWidth  + cursorInteractionPadding,
            cursorBorderWidth: cursorBorderWidth,
            cursorButtonOffset: cursorInteractionPadding + (cursorBorderWidth * 2)
        }

        // Update cursor position and check for interactions 
        window.onmousemove = (e) => {
            window.requestAnimationFrame(() => {
                updateCursor(cursorOptions, e);
                checkForCursorInteraction(e, cursorOptions, buttons, sticky);
            });
        };
        
        window.onscroll = (e) => {
            window.requestAnimationFrame(() => {
                updateCursor(cursorOptions, e);
                checkForCursorInteraction(e, cursorOptions, buttons, sticky);
            });
        };

        //For animating mouse clicks
        window.onmousedown = (e) => {
            window.mouseClicked = true;
            updateCursor(cursorOptions, e);
        }

        window.onmouseup = (e) => {
            window.mouseClicked = false;
            updateCursor(cursorOptions, e);
        }
    }
}

function updateCursor(cursorOptions, e) {
    //Pause if the cursor is interacing with something
    if(!window.cursorInteraction) {
        //how fast is the the cursor moving
        const speedX = Math.abs(e.movementX);
        const speedY = Math.abs(e.movementY);
        const speed = Math.max(speedX, speedY);
        
        //squish the cursor when it moves fast
        const scaleX = speedY > 2 ? 0.85 : 1;
        const scaleY = speedX > 2 ? 0.85 : 1;
        
        //click animation
        const scale = window.mouseClicked ? 0.8 : `${scaleX}, ${scaleY}`;
        
        //calculate position
        const positionX = e.clientX - cursorOptions.cursorPositionOffset;
        const positionY = e.clientY - cursorOptions.cursorPositionOffset;
        
        //set cursor transform
        cursorOptions.cursorElement.style.transform = `translateX(${positionX}px) translateY(${positionY}px) scale(${scale})`;
    }
}

function checkForCursorInteraction(e, cursorOptions, buttonList, sticky) {
    //"sticky" option makes the interaction start before the mouse touches the element
    const interactionBuffer = sticky ? cursorOptions.cursorInteractionBuffer : 0;
    
    //Check each button and calculate positions and stuff
    Array.from(buttonList).some((btn) => {
        const buttonPosition = btn.getBoundingClientRect();
        const interactionTop = buttonPosition.top - interactionBuffer;
        const interactionBottom = buttonPosition.top + buttonPosition.height + interactionBuffer;
        const interactionLeft = buttonPosition.left - interactionBuffer;
        const interactionRight = buttonPosition.left + buttonPosition.width + interactionBuffer;
        const buttonTransform = {
            x: buttonPosition.left + buttonPosition.width / 2,
            y: buttonPosition.top + buttonPosition.height / 2,
        }

        //if the cursor is interacting with this button, animate it
        if (
            e.clientY >= interactionTop &&
            e.clientY <= interactionBottom &&
            e.clientX >= interactionLeft &&
            e.clientX <= interactionRight &&
            (document.elementFromPoint(e.clientX, e.clientY) === btn || btn.contains(document.elementFromPoint(e.clientX, e.clientY)))
        ) {
            window.cursorInteraction = true;
            const movementY = sticky ? (e.clientY - (buttonPosition.top + buttonPosition.height / 2 + interactionBuffer)) / 8 : 0;
            const movementX = sticky ? (e.clientX - (buttonPosition.left + buttonPosition.width / 2 + interactionBuffer)) / 8 : 0;
            btn.style.transform = `translate(${movementX}px, ${movementY}px)`;
            cursorOptions.cursorElement.classList.add('active');
            cursorOptions.cursorElement.style.transform = `translateX(${buttonTransform.x}px) translateY(${buttonTransform.y}px) translate(-50%, -50%)`;
            cursorOptions.cursorElement.style.width = buttonPosition.width + (cursorOptions.cursorButtonOffset * 2) + 'px';
            cursorOptions.cursorElement.style.height = buttonPosition.height + (cursorOptions.cursorButtonOffset * 2) + 'px';
            cursorOptions.cursorElement.style.borderRadius = getComputedStyle(btn).borderRadius ? parseInt(getComputedStyle(btn).borderRadius.replace('px', '')) + cursorOptions.cursorButtonOffset + 'px' : '3px';
            return true;
        } else {
            //if the cursor is not interacting with this button, reset everything
            window.cursorInteraction = false;
            btn.style.transform = '';
            cursorOptions.cursorElement.classList.remove('active');
            cursorOptions.cursorElement.style.width = '';
            cursorOptions.cursorElement.style.height = '';
            cursorOptions.cursorElement.style.transformOrigin = '';
            cursorOptions.cursorElement.style.borderRadius = '';
        }
    });
}