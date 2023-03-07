import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRaspberryPi } from '@fortawesome/free-brands-svg-icons';

const styles = {
    container: {
        maxWidth: '80%',
        margin: '0 auto',
        position: 'relative',
        top: '20%',
        overflow: 'hidden',
    },
    superscript: {
        fontSize: '12px'
    },
    maxHeight: {
        height: '100%'
    },
    title: {
        fontSize: '120px',
        margin: 0
    },
}

export default function HomePage() {
    return (
        <div style={styles.maxHeight} className='background-image-gif'>
            <Head>
                <title>Home App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div style={styles.container}>
                <h1 style={styles.title}>
                    Hello<sup className='asterisk-tip'>*</sup>
                </h1>
                <h2>My name is Danylo - welcome to my webpage!</h2>

                <p style={{ margin: '0 auto' }}>
                    This application is built in NextJS, running on a dedicated <FontAwesomeIcon icon={faRaspberryPi} size='xl' /> Pi server, developed and configured 
                    from scratch; cool!
                </p>

                <p>For a full intuitive breakdown on how this server was configured, or if you're just curious, feel free to check it out <a href="/notes/server-setup">here</a>.</p>

                <p>Otherwise, thanks for visiting! <span style={{fontSize: '22px', lineHeight: '1px'}}>&#129312;</span></p>

                {/* <p style={{ fontSize: '11px', marginTop: '5px' }}>
                    * Queue a cube or something that will follow the cursor or something... *
                </p> */}
            </div>
        </div>
    )
}