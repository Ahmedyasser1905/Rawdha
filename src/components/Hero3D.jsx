import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Hero3D = () => {
    const containerRef = useRef();

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);

        // Materials
        const colors = [0xff6b6b, 0x54a0ff, 0xfeca57, 0xff9ff3];
        const materials = colors.map(color => new THREE.MeshStandardMaterial({
            color,
            roughness: 0.2,
            metalness: 0.2
        }));

        const geometries = [
            new THREE.IcosahedronGeometry(1.5, 0),
            new THREE.TorusGeometry(1.2, 0.4, 16, 50),
            new THREE.SphereGeometry(1.2, 32, 32),
            new THREE.BoxGeometry(1.8, 1.8, 1.8)
        ];

        const shapes = [];
        for (let i = 0; i < 22; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 15 - 5
            );

            mesh.userData = {
                rotSpeedX: (Math.random() - 0.5) * 0.05,
                rotSpeedY: (Math.random() - 0.5) * 0.05,
                initialY: mesh.position.y,
                floatPhase: Math.random() * Math.PI * 2,
                floatSpeed: 0.8 + Math.random() * 0.5
            };

            scene.add(mesh);
            shapes.push(mesh);
        }

        const animate = () => {
            const time = Date.now() * 0.001;

            shapes.forEach(shape => {
                shape.rotation.x += shape.userData.rotSpeedX;
                shape.rotation.y += shape.userData.rotSpeedY;
                shape.position.y = shape.userData.initialY +
                    Math.sin(time * shape.userData.floatSpeed + shape.userData.floatPhase) * 2.5;
            });

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            geometries.forEach(g => g.dispose());
            materials.forEach(m => m.dispose());
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 0 }} // Put at 0 to be in front of body background
        />
    );
};

export default Hero3D;
