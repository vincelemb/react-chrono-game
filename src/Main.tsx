import React, { useContext, useState, useEffect } from 'react';
import {
    Container,
    BgImage,
    Modal,
    HeartBeat,
    PlayerControls,
    Audio,
    TabsGroup,
    OrderedList,
} from './components';
import { useCountdownOverlay, useCountdown, useAudioPlayer } from './logics';
import { CountdownContext } from './context';
import { InfoSvg } from './components/svg';
import { Path } from './config';

const Main = () => {
    const [timeActive, setTimeActive] = useState<boolean>(false);
    const [isModal, setIsModal] = useState<boolean>(false);

    const [stepCardio, setStepCardio] = useState<string>('Inspirez');

    const { setAudioPlaying, musicPlaying, setMusicPlaying, setResetMusic } = useAudioPlayer();

    const { countdownOverlaySeconds } = useCountdownOverlay(isModal);
    const { countdownSeconds } = useCountdown(timeActive);

    const { setCountdownSeconds, setCountdownOverlaySeconds } = useContext(CountdownContext);

    const [changeDataCountdown, setChangeDataCountdown] = useState<boolean>(false);

    const [firstBip, setFirstBip] = useState<number>(0);
    const [stepAnimation, setStepAnimation] = useState<number>(1);
    const [timeNumber, setTimeNumber] = useState<number>(5);
    const [play, setPlay] = useState<any>(null);
    const [animationState, setAnimationState] = useState<string>('paused');

    useEffect(() => {
        if (play === null) {
            setCountdownSeconds(timeNumber * 600);
        }
        if (play === true) {
            setIsModal(true);
            if (isModal && countdownOverlaySeconds === 0) {
                setAnimationState('running');
                setChangeDataCountdown(true);
                setIsModal(false);
                setTimeActive(true);
            }
        } else {
            setAnimationState('paused');
            setTimeActive(false);
        }
    }, [play, timeNumber, countdownOverlaySeconds]);

    useEffect(() => {
        setAudioPlaying(false);
        if (play === true) {
            if (firstBip === 0) {
                setAudioPlaying(true);
                setFirstBip(1);
            }
            if ((countdownSeconds / 10) % 10 === 5) {
                setAudioPlaying(true);
                setStepAnimation(2);
                setStepCardio('Expirez');
            } else if ((countdownSeconds / 10) % 10 === 0) {
                setAudioPlaying(true);
                setStepAnimation(1);
                setStepCardio('Inspirez');
            }

            if (countdownSeconds === 0) {
                reset();
            }
        }
    }, [countdownSeconds]);

    function secondsToTime(seconds) {
        return new Date(seconds * 100).toISOString().substr(14, 5);
    }

    function reset() {
        setFirstBip(0);
        setPlay(null);
        setStepAnimation(1);
        setAnimationState('paused');
        setTimeActive(false);
        setResetMusic(true);
        setMusicPlaying(false);
        setAudioPlaying(false);
        setChangeDataCountdown(false);
    }

    return (
        <BgImage imageUrl={`${Path.imgPath}hero.jpg`}>
            <Container maxWidth="991px" isCenteredX>
                <main className="_p-sm">
                    <TabsGroup
                        noTabsonDesktop={true}
                        contents={[
                            {
                                title: 'Options',
                                subcontent: (
                                    <aside className="_my-md">
                                        <TabsGroup
                                            borderBottomStyle={true}
                                            isCard={true}
                                            contents={[
                                                {
                                                    title: 'étapes',
                                                    subcontent: (
                                                        <OrderedList
                                                            lists={[
                                                                {
                                                                    content: `Faites l'exercice 3 fois par jour, de préférence assis, les yeux ouverts ou fermés, le dos bien droit et les pieds posés à plat au sol.`,
                                                                },
                                                                {
                                                                    content: `Respirez 6 fois par minute : inspirez en comptant jusqu'à 5, puis expirez en comptant jusqu'à 5. Le signal sonore vous aide à vous repérer.`,
                                                                },
                                                                {
                                                                    content: `Idéalement, pratiquez cet exercice pendant 5 minutes`,
                                                                },
                                                            ]}
                                                        />
                                                    ),
                                                },
                                                {
                                                    title: 'le saviez-vous ?',
                                                    subcontent: `Cette technique de relaxation se base sur des exercices de respiration pour
                                                        atteindre un état d'équilibre du système nerveux autonome (notre "pilote
                                                        automatique"). En agissant sur la variabilité du rythme cardiaque, il est possible
                                                        de gérer son état émotionnel et d’améliorer son bien-être physique et psychique :
                                                        moins de stress, meilleur sommeil, meilleure concentration…`,
                                                },
                                            ]}
                                        />
                                    </aside>
                                ),
                            },
                            {
                                title: 'Jouer',
                                subcontent: (
                                    <section className={`_items-center _relative _my-xl`}>
                                        <Modal
                                            title="Partie terminée"
                                            isModal={isModal}
                                            isOverlay={true}
                                            onCloseBtnClick={() => {
                                                setCountdownOverlaySeconds(0);
                                            }}>
                                            <span className="_text-white">
                                                {changeDataCountdown === false ? 'Début dans :' : 'Reprise dans :'}
                                            </span>
                                            <span className="_text-xxl _text-white _py-sm">
                                                {countdownOverlaySeconds}
                                            </span>
                                            <div
                                                className="_w-4/5 _bg-white _rounded-small _border-solid _border-2 _p-sm _border-white _flex"
                                                style={{ backgroundColor: 'rgba(255,255,255,.3)' }}>
                                                <div className="_mr-xs">
                                                    <InfoSvg
                                                        fillColor="#fff"
                                                        svgWidth="20px"
                                                        svgHeight="20px"></InfoSvg>
                                                </div>
                                                <span className="_text-white">
                                                    Essayez de respirer par le ventre pendant cet exercice
                                                </span>
                                            </div>
                                        </Modal>

                                        <section className="_w-full _flex _justify-center _items-center">
                                            <div className="_flex _flex-col">
                                                {play !== null && (
                                                    <span
                                                        className="_text-center _text-xl _text-white _w-full"
                                                        role="status"
                                                        aria-live="polite">
                                                        {stepCardio}
                                                    </span>
                                                )}
                                                <div className="c-cardio-player _relative _flex _justify-center _items-center">
                                                    <HeartBeat
                                                        playingStep={stepAnimation}
                                                        isPlaying={play}
                                                        playingState={animationState}></HeartBeat>
                                                    {play !== null && (
                                                        <span className="_text-center _text-xxl _text-white _z-10">{`${secondsToTime(
                                                            countdownSeconds
                                                        )}`}</span>
                                                    )}
                                                    {play === null && (
                                                        <div className="_w-3/5 _flex _justify-between _items-center">
                                                            <div className="_relative">
                                                                <button
                                                                    className="_relative _z-10 _rounded-rounded _bg-black _min-w-xxl _min-h-xxl _max-h-xxl _opacity-10"
                                                                    onClick={() =>
                                                                        timeNumber > 1
                                                                            ? setTimeNumber(timeNumber - 1)
                                                                            : null
                                                                    }></button>
                                                                <div className="less"></div>
                                                            </div>
                                                            <div className="_flex _flex-col _items-center">
                                                                <span
                                                                    className="_text-xxl _text-white  _text-center _z-10"
                                                                    role="status"
                                                                    aria-live="polite">
                                                                    {timeNumber}
                                                                </span>
                                                                <span className="_text-white _z-10">min</span>
                                                            </div>
                                                            <div className="_relative">
                                                                <button
                                                                    className=" _relative _z-10 _rounded-rounded _bg-black _min-w-xxl _min-h-xxl _max-h-xxl _opacity-10"
                                                                    onClick={() =>
                                                                        timeNumber < 10
                                                                            ? setTimeNumber(timeNumber + 1)
                                                                            : null
                                                                    }></button>
                                                                <div className="more"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </section>

                                        <PlayerControls
                                            play={play}
                                            isPlaying={musicPlaying}
                                            audioFile={'Wind.mp3'}
                                            onClick={{
                                                reset: () => reset(),
                                                pause: () => {
                                                    setCountdownOverlaySeconds(changeDataCountdown ? 3 : 5);
                                                    setPlay(!play);
                                                },
                                                audio: () => {
                                                    setResetMusic(false);
                                                    setMusicPlaying(!musicPlaying);
                                                },
                                            }}
                                        />
                                        <Audio id="audio" audioFile={'bip.mp3'}></Audio>
                                    </section>
                                ),
                            },
                        ]}
                    />
                </main>
            </Container>
        </BgImage>
    );
};

export default Main;
