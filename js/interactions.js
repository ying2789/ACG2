/**
 * interactions.js - Handles user interactions with the AR elements
 */

// Register custom A-Frame components for interactions
AFRAME.registerComponent('gesture-detector', {
    init: function() {
        // Touch events for mobile
        this.el.sceneEl.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.el.sceneEl.addEventListener('touchend', this.onTouchEnd.bind(this));
        
        // Mouse events for desktop
        this.el.sceneEl.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.el.sceneEl.addEventListener('mouseup', this.onMouseUp.bind(this));
        
        // Track if we're in a click action
        this.isClicking = false;
    },
    
    onTouchStart: function(evt) {
        // Prevent default behavior to avoid scrolling
        evt.preventDefault();
        this.isClicking = true;
    },
    
    onTouchEnd: function(evt) {
        if (evt.touches.length > 0) return;
        
        // Only process if we were clicking
        if (!this.isClicking) return;
        this.isClicking = false;
        
        // Get touch position
        const touch = evt.changedTouches[0];
        
        // Convert touch to normalized device coordinates (-1 to +1)
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        
        // Emit raycaster-intersection event with the coordinates
        this.el.emit('raycaster-intersection', {
            x: x,
            y: y
        });
    },
    
    onMouseDown: function(evt) {
        // Track that we're starting a click
        this.isClicking = true;
    },
    
    onMouseUp: function(evt) {
        // Only process if we were clicking
        if (!this.isClicking) return;
        this.isClicking = false;
        
        // Convert mouse position to normalized device coordinates (-1 to +1)
        const x = (evt.clientX / window.innerWidth) * 2 - 1;
        const y = -(evt.clientY / window.innerHeight) * 2 + 1;
        
        // Emit raycaster-intersection event with the coordinates
        this.el.emit('raycaster-intersection', {
            x: x,
            y: y
        });
    }
});

// Raycaster component for detecting interactions
AFRAME.registerComponent('raycaster-listener', {
    init: function() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.camera = document.querySelector('a-entity[camera]').object3D;
        
        this.el.sceneEl.addEventListener('raycaster-intersection', this.onIntersection.bind(this));
    },
    
    onIntersection: function(evt) {
        // Update mouse position
        this.mouse.x = evt.detail.x;
        this.mouse.y = evt.detail.y;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Get intersections with interactive objects
        const interactiveEls = Array.from(document.querySelectorAll('.interactive'));
        const objects = interactiveEls.map(el => el.object3D);
        const intersects = this.raycaster.intersectObjects(objects, true);
        
        if (intersects.length > 0) {
            // Find the A-Frame entity that was intersected
            let object = intersects[0].object;
            let el;
            
            // Traverse up to find the entity
            while (object.parent && !el) {
                if (object.el) {
                    el = object.el;
                }
                object = object.parent;
            }
            
            if (el) {
                // Emit click event on the intersected entity
                el.emit('click');
            }
        }
    }
});

const InteractionManager = {
    // Initialize the interaction system
    init: function() {
        // Add raycaster-listener to the scene
        const scene = document.querySelector('a-scene');
        scene.setAttribute('raycaster-listener', '');
        
        // Add cursor for desktop interaction
        const cursor = document.createElement('a-entity');
        cursor.setAttribute('cursor', 'rayOrigin: mouse');
        cursor.setAttribute('raycaster', 'objects: .interactive');
        scene.appendChild(cursor);
        
        console.log('Interaction system initialized with desktop support');
    },
    
    // Create a dialogue box
    createDialogue: function(character, text, position, duration = 5000) {
        return new Promise((resolve) => {
            const dialogueEntity = document.createElement('a-entity');
            dialogueEntity.setAttribute('position', position);
            dialogueEntity.setAttribute('look-at', '[camera]');
            
            // Create the dialogue box background using dialog.png image
            const dialogueBg = document.createElement('a-plane');
            dialogueBg.setAttribute('width', '1.5');
            dialogueBg.setAttribute('height', '0.5');
            dialogueBg.setAttribute('material', 'src: assets/dialog.png; transparent: true');
            dialogueBg.setAttribute('opacity', '1.0');
            
            // Create the character name text
            const characterText = document.createElement('a-text');
            characterText.setAttribute('value', character);
            characterText.setAttribute('position', '-0.65 0.15 0.01');
            characterText.setAttribute('color', '#4CAF50');
            characterText.setAttribute('width', '1.4');
            characterText.setAttribute('align', 'left');
            
            // Create the dialogue text
            const dialogueText = document.createElement('a-text');
            dialogueText.setAttribute('value', text);
            dialogueText.setAttribute('position', '-0.65 0 0.01');
            dialogueText.setAttribute('color', '#000000');
            dialogueText.setAttribute('width', '1.4');
            dialogueText.setAttribute('align', 'left');
            
            // Assemble the dialogue box
            dialogueEntity.appendChild(dialogueBg);
            dialogueEntity.appendChild(characterText);
            dialogueEntity.appendChild(dialogueText);
            
            // Add to scene
            document.querySelector('#ar-content').appendChild(dialogueEntity);
            
            // Remove after duration
            setTimeout(() => {
                dialogueEntity.parentNode.removeChild(dialogueEntity);
                resolve();
            }, duration);
        });
    },
    
    // Create a narration box at the bottom of the page
    createNarration: function(text, position, duration = 5000) {
        return new Promise((resolve) => {
            // Check if narration container exists, create if not
            let narrationContainer = document.getElementById('narration-container');
            if (!narrationContainer) {
                narrationContainer = document.createElement('div');
                narrationContainer.id = 'narration-container';
                narrationContainer.style.position = 'fixed';
                narrationContainer.style.bottom = '10px';
                narrationContainer.style.left = '50%';
                narrationContainer.style.transform = 'translateX(-50%)';
                narrationContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                narrationContainer.style.color = '#FFFFFF';
                narrationContainer.style.padding = '10px 20px';
                narrationContainer.style.borderRadius = '5px';
                narrationContainer.style.maxWidth = '80%';
                narrationContainer.style.textAlign = 'center';
                narrationContainer.style.zIndex = '1000';
                narrationContainer.style.display = 'none';
                document.body.appendChild(narrationContainer);
            }
            
            // Set the narration text
            narrationContainer.textContent = text;
            narrationContainer.style.display = 'block';
            
            // Remove after duration
            setTimeout(() => {
                narrationContainer.style.display = 'none';
                resolve();
            }, duration);
        });
    }
};
