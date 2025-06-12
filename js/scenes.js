/**
 * scenes.js - Defines and manages the different scenes in the AR story
 */

const SceneManager = {
    // Current scene index
    currentScene: 0,
    
    // Flag for non-AR mode
    nonARMode: false,
    
    // Scene definitions
    scenes: [
        // Scene 1: The First Meeting (Intro Scene)
        {
            id: 'intro',
            title: 'Scene 1: The First Meeting',
            setup: function(arContent) {
                // Clear previous content
                while (arContent.firstChild) {
                    arContent.removeChild(arContent.firstChild);
                }
                
                // Create ground (grass patch with dirt path)
                const ground = ModelManager.createModelEntity('grassPatch', '0 0 0');
                arContent.appendChild(ground);
                
                const path = ModelManager.createModelEntity('dirtPath', '0 0.01 0');
                arContent.appendChild(path);
                
                // Create tree
                const tree = ModelManager.createModelEntity('tree', '1 0 -1', '0 45 0');
                arContent.appendChild(tree);
                
                // Create tortoise
                const tortoise = ModelManager.createModelEntity('tortoise', '-0.6 0.3 0', '0 90 0');
                ModelManager.playAnimation('tortoise', 'idle');
                arContent.appendChild(tortoise);
                
                // Create hare
                const hare = ModelManager.createModelEntity('hare', '0.5 0 0', '0 -90 0');
                ModelManager.playAnimation('hare', 'idle');
                arContent.appendChild(hare);
                
                // Play hare audio
                const hareAudio = new Audio('sounds/naration1.wav');
                hareAudio.volume = 0.7;
                hareAudio.play().catch(error => {
                    console.error('Error playing narration audio:', error);
                });
                
                // Create narration
                InteractionManager.createNarration(
                    "One sunny morning, the Tortoise and the Hare met on a forest path. They'd never raced before… but something was in the air.",
                    '0 1.5 0',
                    9000
                ).then(() => {
                    // After narration, show a HTML button overlay instead of 3D button
                    // Create a HTML button that overlays the scene
                    let talkButtonHTML = document.getElementById('talk-button-html');
                    if (!talkButtonHTML) {
                        talkButtonHTML = document.createElement('button');
                        talkButtonHTML.id = 'talk-button-html';
                        talkButtonHTML.textContent = 'Talk';
                        talkButtonHTML.style.position = 'fixed';
                        talkButtonHTML.style.top = '20px';
                        talkButtonHTML.style.left = '50%';
                        talkButtonHTML.style.transform = 'translateX(-50%)';
                        talkButtonHTML.style.backgroundColor = '#4CAF50';
                        talkButtonHTML.style.color = 'white';
                        talkButtonHTML.style.padding = '10px 20px';
                        talkButtonHTML.style.border = 'none';
                        talkButtonHTML.style.borderRadius = '5px';
                        talkButtonHTML.style.fontSize = '16px';
                        talkButtonHTML.style.cursor = 'pointer';
                        talkButtonHTML.style.zIndex = '1000';
                        talkButtonHTML.addEventListener('click', () => {
                            // Remove the button when clicked
                            if (talkButtonHTML.parentNode) {
                                talkButtonHTML.parentNode.removeChild(talkButtonHTML);
                            }
                            this.triggerDialogue(arContent);
                        });
                        document.body.appendChild(talkButtonHTML);
                    } else {
                        talkButtonHTML.style.display = 'block';
                    }
                });
                
                // Update scene info
                document.getElementById('scene-title').textContent = this.title;
                document.getElementById('scene-instructions').textContent = this.instructions;
                document.getElementById('scene-info').classList.remove('hidden');
            },
            
            triggerDialogue: function(arContent) {
                // Remove HTML talk button if it exists
                const talkButtonHTML = document.getElementById('talk-button-html');
                if (talkButtonHTML && talkButtonHTML.parentNode) {
                    talkButtonHTML.parentNode.removeChild(talkButtonHTML);
                }
                
                // Play hare audio
                const hareAudio = new Audio('sounds/hare1.mp3');
                hareAudio.volume = 0.7;
                
                // Play animations
                ModelManager.playAnimation('hare', 'smug');
                
                // Play hare audio and show dialogue
                hareAudio.play().then(() => {
                    return InteractionManager.createDialogue(
                        'Hare',
                        'Hey slowpoke, want to race just for fun?',
                        '0.5 1 0',
                        5000
                    );
                }).catch(error => {
                    console.error('Error playing hare audio:', error);
                    // Fallback if audio fails to play
                    return InteractionManager.createDialogue(
                        'Hare',
                        'Hey slowpoke, want to race just for fun?',
                        '0.5 1 0',
                        5000
                    );
                }).then(() => {
                    // Play tortoise animation
                    ModelManager.playAnimation('tortoise', 'blink');
                    
                    // Play tortoise audio
                    const tortoiseAudio = new Audio('sounds/tortoise1.mp3');
                    tortoiseAudio.volume = 0.7;
                    
                    // Play tortoise audio and show dialogue
                    return tortoiseAudio.play().then(() => {
                        // Show tortoise dialogue after audio finishes
                        return InteractionManager.createDialogue(
                            'Tortoise',
                            'Sure, let\'s see who keeps going longer.',
                            '-0.5 1 0',
                            5000
                        );
                    }).catch(error => {
                        console.error('Error playing tortoise audio:', error);
                        // Fallback if audio fails to play
                        return InteractionManager.createDialogue(
                            'Tortoise',
                            'Sure, let\'s see who keeps going longer.',
                            '-0.5 1 0',
                            5000
                        );
                    });
                }).then(() => {
                    // Reset animations
                    ModelManager.playAnimation('hare', 'idle');
                    ModelManager.playAnimation('tortoise', 'idle');
                    
                    // Show start race button as HTML button
                    let startButtonHTML = document.getElementById('start-race-button-html');
                    if (!startButtonHTML) {
                        startButtonHTML = document.createElement('button');
                        startButtonHTML.id = 'start-race-button-html';
                        startButtonHTML.textContent = 'Start the Race';
                        startButtonHTML.style.position = 'fixed';
                        startButtonHTML.style.top = '20px';
                        startButtonHTML.style.left = '50%';
                        startButtonHTML.style.transform = 'translateX(-50%)';
                        startButtonHTML.style.backgroundColor = '#4CAF50';
                        startButtonHTML.style.color = 'white';
                        startButtonHTML.style.padding = '10px 20px';
                        startButtonHTML.style.border = 'none';
                        startButtonHTML.style.borderRadius = '5px';
                        startButtonHTML.style.fontSize = '16px';
                        startButtonHTML.style.cursor = 'pointer';
                        startButtonHTML.style.zIndex = '1000';
                        startButtonHTML.addEventListener('click', () => {
                            // Remove the button when clicked
                            if (startButtonHTML.parentNode) {
                                startButtonHTML.parentNode.removeChild(startButtonHTML);
                            }
                            this.nextScene();
                        });
                        document.body.appendChild(startButtonHTML);
                    } else {
                        startButtonHTML.style.display = 'block';
                    }
                });
            },
            
            nextScene: function() {
                // Play narration audio for Scene 2
                const narrationAudio = new Audio('sounds/narration2.mp3');
                narrationAudio.volume = 0.7;
                narrationAudio.play().catch(error => {
                    console.error('Error playing narration audio:', error);
                });
                
                // Load Scene 2
                SceneManager.loadScene(1);
            }
        },
        
        // Scene 2: The Race Begins
        {
            id: 'race-begins',
            title: 'Scene 2: The Race Begins',
            setup: function(arContent) {
                // Clear previous content
                while (arContent.firstChild) {
                    arContent.removeChild(arContent.firstChild);
                }
                
                // Play hare audio
                const hareAudio = new Audio('sounds/naration2.mp3');
                hareAudio.volume = 0.7;
                hareAudio.play().catch(error => {
                    console.error('Error playing narration audio:', error);
                }); 

                // Create ground with longer path
                const ground = ModelManager.createModelEntity('grassPatch', '0 0 0', '0 0 0', '2 1 2');
                arContent.appendChild(ground);
                
                const path = ModelManager.createModelEntity('dirtPath', '0 0.01 0', '0 90 0', '2 1 1');
                arContent.appendChild(path);
                
                // Create trees for scenery
                const tree1 = ModelManager.createModelEntity('tree', '-1 0 -1', '0 45 0');
                arContent.appendChild(tree1);
                
                const tree2 = ModelManager.createModelEntity('tree', '1 0 -1', '0 -30 0');
                arContent.appendChild(tree2);
                
                // Create tortoise at starting position - positioned to the side
                const tortoise = ModelManager.createModelEntity('tortoise', '-1 0.3 0.6', '0 90 0');
                arContent.appendChild(tortoise);
                
                // Create hare at starting position - positioned to the other side
                const hare = ModelManager.createModelEntity('hare', '-0.8 0.0 -0.6', '0 90 0');
                arContent.appendChild(hare);
                
                // Update scene info
                document.getElementById('scene-title').textContent = this.title;
                document.getElementById('scene-instructions').textContent = this.instructions;
                
                // Start the race sequence
                InteractionManager.createNarration(
                    "The race began! The Hare took off with lightning speed while the Tortoise moved steadily.",
                    '0 1.5 0',
                    6000
                ).then(() => {
                    // Animate the hare running
                    ModelManager.playAnimation('hare');
                    
                    // Animate the tortoise walking
                    ModelManager.playAnimation('tortoise', 'walk');
                    
                    // Move the hare quickly - maintaining z-axis position
                    this.moveModel('hare', '-0.8 0.0 -0.6', '1 0 -0.6', 3000);
                    
                    // Move the tortoise slowly - maintaining z-axis position
                    this.moveModel('tortoise', '-1 0.3 0.6', '-0.5 0.3 0.6', 6000);
                    
                    // After animations, show continue button as HTML overlay
                    setTimeout(() => {
                        let continueButtonHTML = document.getElementById('continue-button-html');
                        if (!continueButtonHTML) {
                            continueButtonHTML = document.createElement('button');
                            continueButtonHTML.id = 'continue-button-html';
                            continueButtonHTML.textContent = 'Continue';
                            continueButtonHTML.style.position = 'fixed';
                            continueButtonHTML.style.top = '20px';
                            continueButtonHTML.style.left = '50%';
                            continueButtonHTML.style.transform = 'translateX(-50%)';
                            continueButtonHTML.style.backgroundColor = '#4CAF50';
                            continueButtonHTML.style.color = 'white';
                            continueButtonHTML.style.padding = '10px 20px';
                            continueButtonHTML.style.border = 'none';
                            continueButtonHTML.style.borderRadius = '5px';
                            continueButtonHTML.style.fontSize = '16px';
                            continueButtonHTML.style.cursor = 'pointer';
                            continueButtonHTML.style.zIndex = '1000';
                            continueButtonHTML.addEventListener('click', () => {
                                // Remove the button when clicked
                                if (continueButtonHTML.parentNode) {
                                    continueButtonHTML.parentNode.removeChild(continueButtonHTML);
                                }
                                this.nextScene();
                            });
                            document.body.appendChild(continueButtonHTML);
                        } else {
                            continueButtonHTML.style.display = 'block';
                        }
                    }, 6000);
                });
            },
            
            moveModel: function(modelName, fromPosition, toPosition, duration) {
                const entity = ModelManager.loadedModels[modelName];
                if (!entity) return;
                
                const startPos = fromPosition.split(' ').map(Number);
                const endPos = toPosition.split(' ').map(Number);
                const startTime = Date.now();
                
                function animate() {
                    const now = Date.now();
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const currentPos = startPos.map((start, i) => 
                        start + (endPos[i] - start) * progress
                    );
                    
                    entity.setAttribute('position', currentPos.join(' '));
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }
                
                animate();
            },
            
            nextScene: function() {
                SceneManager.loadScene(2);
            }
        },
        
        // Additional scenes would be defined here...
        // For now, I'm implementing just the first scene in detail as requested
        
        // Scene 3: Tortoise Keeps Going
        {
            id: 'tortoise-keeps-going',
            title: 'Scene 3: Tortoise Keeps Going',
            instructions: 'Tap on Tortoise to hear his thoughts',
            setup: function(arContent) {
                // Clear previous content
                while (arContent.firstChild) {
                    arContent.removeChild(arContent.firstChild);
                }
                
                // Play hare audio
                const hareAudio = new Audio('sounds/naration3.mp3');
                hareAudio.volume = 0.7;
                hareAudio.play().catch(error => {
                    console.error('Error playing narration audio:', error);
                });
                // Create ground with longer path
                const ground = ModelManager.createModelEntity('grassPatch', '0 0 0', '0 0 0', '2 1 2');
                arContent.appendChild(ground);
                
                const path = ModelManager.createModelEntity('dirtPath', '0 0.01 0', '0 90 0', '2 1 1');
                arContent.appendChild(path);
                
                // Create trees for scenery
                const tree1 = ModelManager.createModelEntity('tree', '-1 0 -1', '0 45 0');
                arContent.appendChild(tree1);
                
                const tree2 = ModelManager.createModelEntity('tree', '1 0 -1', '0 -30 0');
                arContent.appendChild(tree2);
                
                // Create tortoise in the middle of the path
                const tortoise = ModelManager.createModelEntity('tortoise', '-0.5 0.3 0', '0 90 0');
                tortoise.setAttribute('class', 'interactive'); // Make tortoise interactive for tapping
                tortoise.setAttribute('id', 'tortoise-model');
                ModelManager.playAnimation('tortoise', 'walk'); // Start with walking animation
                arContent.appendChild(tortoise);
                
                // Add click event listener to tortoise
                tortoise.addEventListener('click', () => {
                    this.showTortoiseThoughts(arContent);
                });
                
                // Update scene info
                document.getElementById('scene-title').textContent = this.title;
                document.getElementById('scene-instructions').textContent = this.instructions;
                
                // Start the scene with narration
                InteractionManager.createNarration(
                    "As Hare speeds ahead, Tortoise stays focused, moving at his own pace.",
                    '0 1.5 0',
                    6000
                ).then(() => {
                    // Start tortoise movement animation
                    this.animateTortoiseMovement();
                });
            },
            
            // Show tortoise thoughts when tapped
            showTortoiseThoughts: function(arContent) {
                // Play tortoise animation
                ModelManager.playAnimation('tortoise', 'blink');
                
                // Play tortoise audio
                const tortoiseAudio = new Audio('sounds/tortoise2.mp3');
                tortoiseAudio.volume = 0.7;
                
                // Play tortoise audio and show dialogue
                return tortoiseAudio.play().then(() => {
                    // Show tortoise dialogue after audio finishes
                    return InteractionManager.createDialogue(
                        'Tortoise',
                        "No rush. I'll just keep moving forward.",
                        '-0.5 1 0',
                        5000
                    );
                }).catch(error => {
                    console.error('Error playing tortoise audio:', error);
                    // Fallback if audio fails to play
                    return InteractionManager.createDialogue(
                        'Tortoise',
                        "No rush. I'll just keep moving forward.",
                        '-0.5 1 0',
                        5000
                    );
                }).then(() => {
                    // Resume walking animation
                    ModelManager.playAnimation('tortoise', 'walk');
                });
            },
            
            // Animate the tortoise moving forward slowly
            animateTortoiseMovement: function() {
                const tortoise = document.getElementById('tortoise-model');
                const startPos = '-0.5 0.3 0';
                const endPos = '0.5 0.3 0';
                const duration = 10000; // 10 seconds for slow movement
                
                const startTime = Date.now();
                const startPosArray = startPos.split(' ').map(Number);
                const endPosArray = endPos.split(' ').map(Number);
                
                const animate = () => {
                    const now = Date.now();
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const currentPos = startPosArray.map((start, i) => 
                        start + (endPosArray[i] - start) * progress
                    );
                    
                    tortoise.setAttribute('position', currentPos.join(' '));
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // When animation completes, show continue button as HTML overlay
            let continueButtonHTML = document.getElementById('continue-button-html-scene3');
            if (!continueButtonHTML) {
                continueButtonHTML = document.createElement('button');
                continueButtonHTML.id = 'continue-button-html-scene3';
                continueButtonHTML.textContent = 'Continue';
                continueButtonHTML.style.position = 'fixed';
                continueButtonHTML.style.top = '20px';
                continueButtonHTML.style.left = '50%';
                continueButtonHTML.style.transform = 'translateX(-50%)';
                continueButtonHTML.style.backgroundColor = '#4CAF50';
                continueButtonHTML.style.color = 'white';
                continueButtonHTML.style.padding = '10px 20px';
                continueButtonHTML.style.border = 'none';
                continueButtonHTML.style.borderRadius = '5px';
                continueButtonHTML.style.fontSize = '16px';
                continueButtonHTML.style.cursor = 'pointer';
                continueButtonHTML.style.zIndex = '1000';
                continueButtonHTML.addEventListener('click', () => {
                    // Remove the button when clicked
                    if (continueButtonHTML.parentNode) {
                        continueButtonHTML.parentNode.removeChild(continueButtonHTML);
                    }
                    this.nextScene();
                });
                document.body.appendChild(continueButtonHTML);
            } else {
                continueButtonHTML.style.display = 'block';
            }
                    }
                };
                
                animate();
            },
            
            nextScene: function() {
                // Move to Scene 4 when implemented
                // For now, loop back to first scene
                SceneManager.loadScene(3);
            }
        },
        
        // Scene 4: The Nap Scene - You Decide
        {
            id: 'nap-scene',
            title: 'Scene 4: The Nap Scene – You Decide',
            instructions: 'Choose what happens next',
            setup: function(arContent) {
                // Clear previous content
                while (arContent.firstChild) {
                    arContent.removeChild(arContent.firstChild);
                }
                
                // Play hare audio
                const hareAudio = new Audio('sounds/naration4.mp3');
                hareAudio.volume = 0.7;
                hareAudio.play().catch(error => {
                    console.error('Error playing narration audio:', error);
                });
                
                // Create ground with longer path
                const ground = ModelManager.createModelEntity('grassPatch', '0 0 0', '0 0 0', '3 1 3');
                arContent.appendChild(ground);
                
                const path = ModelManager.createModelEntity('dirtPath', '0 0.01 0', '0 90 0', '2 1 1');
                arContent.appendChild(path);
                
                // Create tree for the hare to rest under
                const tree = ModelManager.createModelEntity('tree', '0.5 0 -0.5', '0 45 0', '0.007 0.007 0.007');
                arContent.appendChild(tree);
                
                // Create hare in sleeping position under the tree
                const hare = ModelManager.createModelEntity('hare', '0.5 0.0 -0.3', '0 -45 0');
                hare.setAttribute('id', 'hare-model');
                ModelManager.playAnimation('hare', 'sleep'); // Start with sleeping animation
                arContent.appendChild(hare);
                
                // Create tortoise approaching
                const tortoise = ModelManager.createModelEntity('tortoise', '-0.5 0.3 0.3', '0 90 0');
                tortoise.setAttribute('id', 'tortoise-model');
                tortoise.setAttribute('class', 'scene4-tortoise'); // Add a class for easier selection
                ModelManager.playAnimation('tortoise', 'walk'); // Walking animation
                arContent.appendChild(tortoise);
                
                // Update scene info
                document.getElementById('scene-title').textContent = this.title;
                document.getElementById('scene-instructions').textContent = this.instructions;
                
                // Start the scene with narration
                InteractionManager.createNarration(
                    "Hare, tired from his fast start, takes a nap, while Tortoise moves steadily forward.",
                    '0 1.5 0',
                    6000
                ).then(() => {
                    // Create interactive choice buttons
                    this.showChoiceButtons(arContent);
                });
            },
            
            // Show the interactive choice buttons
            showChoiceButtons: function(arContent) {
                // Create "Let Hare Sleep" button as HTML overlay
                let sleepButtonHTML = document.getElementById('sleep-button-html');
                if (!sleepButtonHTML) {
                    sleepButtonHTML = document.createElement('button');
                    sleepButtonHTML.id = 'sleep-button-html';
                    sleepButtonHTML.textContent = 'Let Hare Sleep';
                    sleepButtonHTML.style.position = 'fixed';
                    sleepButtonHTML.style.top = '20px';
                    sleepButtonHTML.style.left = '30%';
                    sleepButtonHTML.style.transform = 'translateX(-50%)';
                    sleepButtonHTML.style.backgroundColor = '#4CAF50';
                    sleepButtonHTML.style.color = 'white';
                    sleepButtonHTML.style.padding = '10px 20px';
                    sleepButtonHTML.style.border = 'none';
                    sleepButtonHTML.style.borderRadius = '5px';
                    sleepButtonHTML.style.fontSize = '16px';
                    sleepButtonHTML.style.cursor = 'pointer';
                    sleepButtonHTML.style.zIndex = '1000';
                    sleepButtonHTML.addEventListener('click', () => {
                        // Remove both buttons when clicked
                        this.removeChoiceButtons();
                        this.letHareSleep(arContent);
                    });
                    document.body.appendChild(sleepButtonHTML);
                } else {
                    sleepButtonHTML.style.display = 'block';
                }
                
                // Create "Cheer for Tortoise" button as HTML overlay
                let cheerButtonHTML = document.getElementById('cheer-button-html');
                if (!cheerButtonHTML) {
                    cheerButtonHTML = document.createElement('button');
                    cheerButtonHTML.id = 'cheer-button-html';
                    cheerButtonHTML.textContent = 'Cheer for Tortoise';
                    cheerButtonHTML.style.position = 'fixed';
                    cheerButtonHTML.style.top = '20px';
                    cheerButtonHTML.style.left = '70%';
                    cheerButtonHTML.style.transform = 'translateX(-50%)';
                    cheerButtonHTML.style.backgroundColor = '#4CAF50';
                    cheerButtonHTML.style.color = 'white';
                    cheerButtonHTML.style.padding = '10px 20px';
                    cheerButtonHTML.style.border = 'none';
                    cheerButtonHTML.style.borderRadius = '5px';
                    cheerButtonHTML.style.fontSize = '16px';
                    cheerButtonHTML.style.cursor = 'pointer';
                    cheerButtonHTML.style.zIndex = '1000';
                    cheerButtonHTML.addEventListener('click', () => {
                        // Remove both buttons when clicked
                        this.removeChoiceButtons();
                        this.cheerForTortoise(arContent);
                    });
                    document.body.appendChild(cheerButtonHTML);
                } else {
                    cheerButtonHTML.style.display = 'block';
                }
            },
            
            // Handle the "Let Hare Sleep" choice
            letHareSleep: function(arContent) {
                // Play snore sound effect
                this.playSound('sounds/snore.wav');
                
                // Play hare audio
                const hareAudio = new Audio('sounds/naration6.mp3');
                hareAudio.volume = 0.7;
                hareAudio.play().catch(error => {
                    console.error('Error playing narration audio:', error);
                });

                // Show narration about the choice
                InteractionManager.createNarration(
                    
                    "The Hare continues to sleep soundly...",
                    '0 1.5 0',
                    4000
                ).then(() => {
                    // Show the choice buttons again after a delay
                    setTimeout(() => {
                        this.showChoiceButtons(arContent);
                    }, 2000);
                });
            },
            
            // Handle the "Cheer for Tortoise" choice
            cheerForTortoise: function(arContent) {
                // Remove choice buttons
                this.removeChoiceButtons();
                
                // Play cheer sound effect
                this.playSound('sounds/cheer.wav');
                
                // Move tortoise past the sleeping hare
                // Find the tortoise using the class selector instead of ID
                const tortoise = document.querySelector('.scene4-tortoise');
                
                if (!tortoise) {
                    console.error('Could not find tortoise model');
                    return;
                }
                
                console.log('Moving tortoise:', tortoise);
                
                // Define start and end positions explicitly
                const startPos = '-0.5 0.3 0.3';
                const endPos = '0.8 0.3 0.3';
                const duration = 5000; // 5 seconds for movement
                
                // Set initial position to make sure we start from the right place
                tortoise.setAttribute('position', startPos);
                
                const startPosArray = startPos.split(' ').map(Number);
                const endPosArray = endPos.split(' ').map(Number);
                const startTime = Date.now();
                
                // Make sure the tortoise is visible and walking
                tortoise.setAttribute('visible', 'true');
                ModelManager.playAnimation('tortoise', 'walk');
                
                const animate = () => {
                    const now = Date.now();
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const currentPos = startPosArray.map((start, i) => 
                        start + (endPosArray[i] - start) * progress
                    );
                    
                    tortoise.setAttribute('position', currentPos.join(' '));
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // Play hare audio
                        const hareAudio = new Audio('sounds/naration7.mp3');
                        hareAudio.volume = 0.7;
                        hareAudio.play().catch(error => {
                            console.error('Error playing narration audio:', error);
                        });

                        // Show narration about the choice
                        InteractionManager.createNarration(
                            "The Tortoise moves ahead while the Hare sleeps!",
                            '0 1.5 0',
                            4000
                        ).then(() => {
                            // Show continue button as HTML overlay
                            let continueButtonHTML = document.getElementById('continue-scene-button-html');
                            if (!continueButtonHTML) {
                                continueButtonHTML = document.createElement('button');
                                continueButtonHTML.id = 'continue-scene-button-html';
                                continueButtonHTML.textContent = 'Continue to Next Scene';
                                continueButtonHTML.style.position = 'fixed';
                                continueButtonHTML.style.top = '20px';
                                continueButtonHTML.style.left = '50%';
                                continueButtonHTML.style.transform = 'translateX(-50%)';
                                continueButtonHTML.style.backgroundColor = '#4CAF50';
                                continueButtonHTML.style.color = 'white';
                                continueButtonHTML.style.padding = '10px 20px';
                                continueButtonHTML.style.border = 'none';
                                continueButtonHTML.style.borderRadius = '5px';
                                continueButtonHTML.style.fontSize = '16px';
                                continueButtonHTML.style.cursor = 'pointer';
                                continueButtonHTML.style.zIndex = '1000';
                                continueButtonHTML.addEventListener('click', () => {
                                    // Remove the button when clicked
                                    if (continueButtonHTML.parentNode) {
                                        continueButtonHTML.parentNode.removeChild(continueButtonHTML);
                                    }
                                    this.nextScene();
                                });
                                document.body.appendChild(continueButtonHTML);
                            } else {
                                continueButtonHTML.style.display = 'block';
                            }
                        });
                    }
                };
                
                animate();
            },
            
            // Helper function to remove choice buttons
            removeChoiceButtons: function() {
                // Remove HTML buttons
                const sleepButtonHTML = document.getElementById('sleep-button-html');
                const cheerButtonHTML = document.getElementById('cheer-button-html');
                
                if (sleepButtonHTML && sleepButtonHTML.parentNode) sleepButtonHTML.parentNode.removeChild(sleepButtonHTML);
                if (cheerButtonHTML && cheerButtonHTML.parentNode) cheerButtonHTML.parentNode.removeChild(cheerButtonHTML);
                
                // Also remove any legacy 3D buttons if they exist
                const sleepButton = document.getElementById('sleep-button');
                const cheerButton = document.getElementById('cheer-button');
                
                if (sleepButton && sleepButton.parentNode) sleepButton.parentNode.removeChild(sleepButton);
                if (cheerButton && cheerButton.parentNode) cheerButton.parentNode.removeChild(cheerButton);
            },
            
            // Helper function to play sound effects
            playSound: function(soundFile) {
                // Create audio element
                const audio = new Audio(soundFile);
                audio.volume = 0.5; // Set volume to 50%
                
                // Play the sound
                audio.play().catch(error => {
                    console.error('Error playing sound:', error);
                });
            },
            
            nextScene: function() {
                // Move to Scene 5
                SceneManager.loadScene(4);
            }
        },

        // Scene 5: The Finish Line
        {
            id: 'finish-line',
            title: 'Scene 5: The Finish Line',
            instructions: 'Tap on the finish line',
            setup: function(arContent) {
                // Clear previous content
                while (arContent.firstChild) {
                    arContent.removeChild(arContent.firstChild);
                }
                
                // Create ground with longer path
                const ground = ModelManager.createModelEntity('grassPatch', '0 0 0', '0 0 0', '2 1 2');
                arContent.appendChild(ground);
                
                const path = ModelManager.createModelEntity('dirtPath', '0 0.01 0', '0 90 0', '2 1 1');
                arContent.appendChild(path);
                
                // Create finish line
                const finishLine = ModelManager.createModelEntity('finish', '0.8 0.8 0', '0 -90 0', '0.25 0.25 0.25');
                finishLine.setAttribute('id', 'finish-line-model');
                finishLine.setAttribute('class', 'interactive');
                finishLine.addEventListener('click', () => this.animateRaceFinish(arContent));
                arContent.appendChild(finishLine);
                
                // Create tortoise at starting position - facing right direction
                const tortoise = ModelManager.createModelEntity('tortoise', '-1.1 0.3 0.2', '0 90 0');
                tortoise.setAttribute('id', 'tortoise-model');
                ModelManager.playAnimation('tortoise', 'idle'); 
                arContent.appendChild(tortoise);
                
                // Create hare at starting position - facing right direction but initially invisible
                const hare = ModelManager.createModelEntity('hare', '-1.5 0.0 -0.2', '0 90 0');
                hare.setAttribute('id', 'hare-model');
                hare.setAttribute('visible', 'false'); // Initially invisible
                ModelManager.playAnimation('hare');
                arContent.appendChild(hare);
                
                // Update scene info
                document.getElementById('scene-title').textContent = this.title;
                document.getElementById('scene-instructions').textContent = 'Tap on the finish line to start the final race!';
            },
            
            // Animate tortoise racing to the finish line, with hare appearing later
            animateRaceFinish: function(arContent) {
                const tortoise = document.getElementById('tortoise-model');
                const hare = document.getElementById('hare-model');
                
                // Start positions
                const tortoiseStartPos = '-1.1 0.3 0.2';
                const hareStartPos = '-1.5 0.0 -0.2';
                
                // End positions - tortoise crosses finish line, hare just behind
                const tortoiseEndPos = '1.5 0.3 0.2'; // Past the finish line
                const hareEndPos = '1.0 0.0 -0.2'; // Just before finish line
                
                // Set initial positions and animations
                tortoise.setAttribute('position', tortoiseStartPos);
                hare.setAttribute('position', hareStartPos);
                hare.setAttribute('visible', 'false'); // Ensure hare is invisible at start
                
                // Force tortoise animation to play
                setTimeout(() => {
                    ModelManager.playAnimation('tortoise', 'walk');
                }, 100);
                
                // Parse positions to arrays for animation
                const tortoiseStartArray = tortoiseStartPos.split(' ').map(Number);
                const tortoiseEndArray = tortoiseEndPos.split(' ').map(Number);
                const hareStartArray = hareStartPos.split(' ').map(Number);
                const hareEndArray = hareEndPos.split(' ').map(Number);
                
                const startTime = Date.now();
                const duration = 5000; // 5 seconds for the race
                let tortoiseFinished = false;
                let hareAppeared = false;
                
                const animate = () => {
                    const now = Date.now();
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Tortoise moves steadily
                    const tortoiseProgress = progress;
                    const tortoisePos = tortoiseStartArray.map((start, i) => 
                        start + (tortoiseEndArray[i] - start) * tortoiseProgress
                    );
                    tortoise.setAttribute('position', tortoisePos.join(' '));
                    
                    // Check if tortoise has crossed finish line (around 80% of the way)
                    if (progress >= 0.8 && !tortoiseFinished) {
                        tortoiseFinished = true;
                        
                        // Schedule hare to appear 2 seconds after tortoise crosses finish line
                        setTimeout(() => {
                            hare.setAttribute('visible', 'true'); // Make hare visible
                            ModelManager.playAnimation('hare');
                            hareAppeared = true;
                            
                            // Animate hare from start to finish quickly
                            const hareAnimStartTime = Date.now();
                            const hareAnimDuration = 3000; // 3 seconds for hare to catch up
                            
                            const animateHare = () => {
                                const hareNow = Date.now();
                                const hareElapsed = hareNow - hareAnimStartTime;
                                const hareProgress = Math.min(hareElapsed / hareAnimDuration, 1);
                                
                                const harePos = hareStartArray.map((start, i) => 
                                    start + (hareEndArray[i] - start) * hareProgress
                                );
                                hare.setAttribute('position', harePos.join(' '));
                                
                                if (hareProgress < 1) {
                                    requestAnimationFrame(animateHare);
                                } else {
                                    // Hare animation complete
                                    ModelManager.playAnimation('hare');
                                    
                                    // Show narration after both finish
                                    this.showFinishNarration(arContent);
                                }
                            };
                            
                            animateHare();
                        }, 2000); // 2 second delay before hare appears
                    }
                    
                    if (progress < 1 && !hareAppeared) {
                        requestAnimationFrame(animate);
                    } else if (progress >= 1 && !hareAppeared) {
                        // Tortoise finished but hare hasn't appeared yet
                        ModelManager.playAnimation('tortoise', 'idle'); // Proud stance
                    }
                };
                
                animate();
            },
            
            // Show narration after race finishes
            showFinishNarration: function(arContent) {
                const naration7 = new Audio('sounds/naration8.mp3');
                naration7.volume = 0.7;
                naration7.play().catch(error => {
                    console.error('Error playing narration audio:', error);
                });
                // Play narration
                InteractionManager.createNarration(
                    "And just like that, Tortoise crosses the finish line, steady and calm. Hare arrives just moments later, surprised and exhausted.",
                    '0 1.5 0',
                    9000
                ).then(() => {
                    // Show continue button as HTML overlay
                    let continueButtonHTML = document.getElementById('continue-button-html-scene5');
                    if (!continueButtonHTML) {
                        continueButtonHTML = document.createElement('button');
                        continueButtonHTML.id = 'continue-button-html-scene5';
                        continueButtonHTML.textContent = 'Continue';
                        continueButtonHTML.style.position = 'fixed';
                        continueButtonHTML.style.top = '20px';
                        continueButtonHTML.style.left = '50%';
                        continueButtonHTML.style.transform = 'translateX(-50%)';
                        continueButtonHTML.style.backgroundColor = '#4CAF50';
                        continueButtonHTML.style.color = 'white';
                        continueButtonHTML.style.padding = '10px 20px';
                        continueButtonHTML.style.border = 'none';
                        continueButtonHTML.style.borderRadius = '5px';
                        continueButtonHTML.style.fontSize = '16px';
                        continueButtonHTML.style.cursor = 'pointer';
                        continueButtonHTML.style.zIndex = '1000';
                        continueButtonHTML.addEventListener('click', () => {
                            // Remove the button when clicked
                            if (continueButtonHTML.parentNode) {
                                continueButtonHTML.parentNode.removeChild(continueButtonHTML);
                            }
                            this.nextScene();
                        });
                        document.body.appendChild(continueButtonHTML);
                    } else {
                        continueButtonHTML.style.display = 'block';
                    }
                });
            },
            
            // Navigate to Scene 6 (Moral & Ending)
            nextScene: function() {
                SceneManager.loadScene(5); // Load Scene 6 (index 5)
            },
        },
        
        // Scene 6: Moral & Ending
        {
            id: 'moral-ending',
            title: 'Scene 6: Moral & Ending',
            instructions: 'Tap on the quote board',
            setup: function(arContent) {
                // Clear previous content
                while (arContent.firstChild) {
                    arContent.removeChild(arContent.firstChild);
                }
                
                // Create ground
                const ground = ModelManager.createModelEntity('grassPatch', '0 0 0', '0 0 0', '2 1 2');
                arContent.appendChild(ground);
                
                // Create tortoise and hare standing side by side
                const tortoise = ModelManager.createModelEntity('tortoise', '-0.6 0.3 0', '0 45 0');
                tortoise.setAttribute('id', 'tortoise-model');
                ModelManager.playAnimation('tortoise', 'idle');
                arContent.appendChild(tortoise);
                
                const hare = ModelManager.createModelEntity('hare', '0.6 0.0 0', '0 -45 0');
                hare.setAttribute('id', 'hare-model');
                ModelManager.playAnimation('hare', 'idle');
                arContent.appendChild(hare);
                
                const naration8 = new Audio('sounds/tortoise3.mp3');
                naration8.volume = 0.7;
                naration8.play().catch(error => {
                    console.error('Error playing narration audio:', error);
                });
                // Show tortoise dialogue
                InteractionManager.createDialogue(
                    'Tortoise',
                    "Slow and steady wins the race!",
                    '-0.6 1 0',
                    4000
                ).then(() => {
                    const naration9 = new Audio('sounds/hare2.mp3');
                    naration9.volume = 0.7;
                    naration9.play().catch(error => {
                        console.error('Error playing narration audio:', error);
                    });
                    
                    // Show hare dialogue
                    return InteractionManager.createDialogue(
                        'Hare',
                        "I... I should've kept going!",
                        '0.6 1 0',
                        4000
                    );
                });
                
                // Create quote board
                const quoteBoard = document.createElement('a-entity');
                quoteBoard.setAttribute('position', '0 1.2 0');
                quoteBoard.setAttribute('geometry', 'primitive: plane; width: 1.5; height: 0.8');
                quoteBoard.setAttribute('material', 'color: #f5f5dc; opacity: 0.9');
                quoteBoard.setAttribute('class', 'interactive');
                quoteBoard.setAttribute('id', 'quote-board');
                quoteBoard.addEventListener('click', () => this.showMoral(arContent));
                
                // Add text to the quote board
                const quoteText = document.createElement('a-text');
                quoteText.setAttribute('value', 'Tap to reveal the moral');
                quoteText.setAttribute('align', 'center');
                quoteText.setAttribute('position', '0 0 0.01');
                quoteText.setAttribute('color', '#333');
                quoteText.setAttribute('width', '1.4');
                quoteText.setAttribute('id', 'quote-text');
                
                quoteBoard.appendChild(quoteText);
                arContent.appendChild(quoteBoard);
                
                // Update scene info
                document.getElementById('scene-title').textContent = this.title;
                document.getElementById('scene-instructions').textContent = this.instructions;
                document.getElementById('scene-info').classList.remove('hidden');
            },
            
            // Show moral when quote board is tapped
            showMoral: function(arContent) {
                const naration10 = new Audio('sounds/naration9.mp3');
                naration10.volume = 0.7;
                naration10.play().catch(error => {
                    console.error('Error playing narration audio:', error);
                });
                
                InteractionManager.createNarration(
                    "The race doesn\'t always go to the fastest, but to those who keep going.",
                    '0 1.5 0',
                    9000
                ).then(() => {
                    // Add exit button as HTML overlay in the middle of the screen
                    let exitButtonHTML = document.getElementById('exit-button-html');
                    if (!exitButtonHTML) {
                        exitButtonHTML = document.createElement('button');
                        exitButtonHTML.id = 'exit-button-html';
                        exitButtonHTML.textContent = 'Exit Story';
                        exitButtonHTML.style.position = 'fixed';
                        exitButtonHTML.style.top = '50%';
                        exitButtonHTML.style.left = '50%';
                        exitButtonHTML.style.transform = 'translate(-50%, -50%)';
                        exitButtonHTML.style.backgroundColor = '#4CAF50';
                        exitButtonHTML.style.color = 'white';
                        exitButtonHTML.style.padding = '15px 30px';
                        exitButtonHTML.style.border = 'none';
                        exitButtonHTML.style.borderRadius = '5px';
                        exitButtonHTML.style.fontSize = '18px';
                        exitButtonHTML.style.cursor = 'pointer';
                        exitButtonHTML.style.zIndex = '1000';
                        exitButtonHTML.addEventListener('click', () => {
                            // Remove the button when clicked
                            if (exitButtonHTML.parentNode) {
                                exitButtonHTML.parentNode.removeChild(exitButtonHTML);
                            }
                            // Show thank you message
                            const thankYouMessage = document.createElement('a-entity');
                            thankYouMessage.setAttribute('position', '0 1.5 0');
                            thankYouMessage.setAttribute('text', 'value: Thanks for playing!; align: center; width: 3; color: #4CAF50');
                            arContent.appendChild(thankYouMessage);
                            
                            // Hide scene info
                            document.getElementById('scene-info').classList.add('hidden');
                        });
                        document.body.appendChild(exitButtonHTML);
                    } else {
                        exitButtonHTML.style.display = 'block';
                    }
                });
            },
            
        }
    ],
    
    // Initialize the scene manager
    init: function() {
        console.log('Scene Manager initialized');
        this.setupNextSceneButton();
    },
    
    // Set up the navigation buttons
    setupNextSceneButton: function() {
        // Set up Next Scene button
        const nextSceneButton = document.querySelector('#next-scene-button button');
        if (nextSceneButton) {
            nextSceneButton.addEventListener('click', () => {
                if (this.currentScene < this.scenes.length - 1) {
                    this.loadScene(this.currentScene + 1);
                } else {
                    // Loop back to first scene if at the end
                    this.loadScene(0);
                }
            });
        }
        
        // Set up Previous Scene button
        const prevSceneButton = document.querySelector('#prev-scene-button button');
        if (prevSceneButton) {
            prevSceneButton.addEventListener('click', () => {
                if (this.currentScene > 0) {
                    this.loadScene(this.currentScene - 1);
                } else {
                    // Loop to last scene if at the beginning
                    this.loadScene(this.scenes.length - 1);
                }
            });
        }
        
        // Show the navigation buttons after initialization
        document.getElementById('navigation-buttons').classList.remove('hidden');
    },
    
    // Set non-AR mode
    setNonARMode: function(enabled) {
        this.nonARMode = enabled;
        console.log('Non-AR mode:', enabled);
    },
    
    // Get the appropriate content container based on mode
    getContentContainer: function() {
        if (this.nonARMode) {
            return document.querySelector('#fallback-content');
        } else {
            return document.querySelector('#ar-content');
        }
    },
    
    // Load a specific scene by index
    loadScene: function(sceneIndex) {
        if (sceneIndex >= 0 && sceneIndex < this.scenes.length) {
            this.currentScene = sceneIndex;
            const contentContainer = this.getContentContainer();
            this.scenes[sceneIndex].setup(contentContainer);
        } else {
            console.error(`Scene index ${sceneIndex} out of bounds`);
        }
    },
    
    // Get the current scene
    getCurrentScene: function() {
        return this.scenes[this.currentScene];
    }
};
