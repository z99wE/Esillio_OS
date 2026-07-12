import { motion } from "framer-motion";

export default function Background() {

    return (

        <div className="background-root">

            <motion.div
                className="gradient gradient-one"
                animate={{
                    x:[0,180,-80,0],
                    y:[0,-120,60,0],
                    scale:[1,1.2,.95,1]
                }}
                transition={{
                    duration:30,
                    repeat:Infinity,
                    ease:"easeInOut"
                }}
            />

            <motion.div
                className="gradient gradient-two"
                animate={{
                    x:[0,-150,90,0],
                    y:[0,90,-60,0],
                    scale:[1,.9,1.15,1]
                }}
                transition={{
                    duration:38,
                    repeat:Infinity,
                    ease:"easeInOut"
                }}
            />

            <motion.div
                className="gradient gradient-three"
                animate={{
                    x:[0,120,-90,0],
                    y:[0,-90,120,0],
                    scale:[1,1.1,1,1]
                }}
                transition={{
                    duration:42,
                    repeat:Infinity,
                    ease:"easeInOut"
                }}
            />

            <div className="mesh-overlay"/>

            <div className="grain-overlay"/>

        </div>

    );

}