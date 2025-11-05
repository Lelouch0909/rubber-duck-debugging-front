'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';



export function DuckAnimation({ type = 'thinking', size = 'md' }: DuckAnimationProps) {
    const [currentFrame, setCurrentFrame] = useState(0);

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    const animations = {
        thinking: {
            duration: 2,
            frames: [
                { rotate: 0, y: 0 },
                { rotate: -5, y: -2 },
                { rotate: 5, y: -1 },
                { rotate: 0, y: 0 }
            ]
        },
        explaining: {
            duration: 1.5,
            frames: [
                { rotate: 0, scale: 1 },
                { rotate: 10, scale: 1.1 },
                { rotate: -10, scale: 1.1 },
                { rotate: 0, scale: 1 }
            ]
        },
        encouraging: {
            duration: 0.8,
            frames: [
                { y: 0, rotate: 0 },
                { y: -8, rotate: 5 },
                { y: 0, rotate: 0 }
            ]
        },
        celebrating: {
            duration: 1,
            frames: [
                { rotate: 0, scale: 1, y: 0 },
                { rotate: 15, scale: 1.2, y: -5 },
                { rotate: -15, scale: 1.2, y: -5 },
                { rotate: 0, scale: 1, y: 0 }
            ]
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFrame((prev) => (prev + 1) % animations[type].frames.length);
        }, (animations[type].duration * 1000) / animations[type].frames.length);

        return () => clearInterval(interval);
    }, [type]);

    return (
        <motion.div
            className={`${sizeClasses[size]} flex items-center justify-center`}
            animate={animations[type].frames[currentFrame]}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-white to-yellow-400 border-2 border-yellow-500 flex items-center justify-center relative overflow-hidden">
                {/* Duck eye */}
                <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-1/3 left-1/2 transform -translate-x-1/2"></div>

                {/* Beak */}
                <div className="w-1 h-1 bg-orange-400 absolute top-1/2 left-3/4 transform rotate-45"></div>

                {/* Expression based on type */}
                {type === 'celebrating' && (
                    <motion.div
                        className="absolute inset-0 bg-yellow-300 opacity-50 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />
                )}
            </div>
        </motion.div>
    );
}