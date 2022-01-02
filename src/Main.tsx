import React, { useState, useEffect, useContext } from 'react';
import { Path } from './config';
import {
    Audio,
    PlayerControls,
    CircleGrow,
    Container,
    BgImage,
    Modal,
    TabsGroup,
    OrderedList,
} from './components';
import { InfoSvg } from './components/svg';
import chronoType from './type/chronoType';
import './styles/index.scss';
import {
    useCountdownOverlay,
    useAudioPlayer,
    useScoreTimer,
} from './logics';
import {
    CountdownContext,
    TimerContext,
} from './context';

const Main = () => {
    const [timeActive, setTimeActive] = useState<boolean>(false);
    const [isModal, setIsModal] = useState<boolean>(false);

    const chronoStep: chronoType = {
        stepSeconds: [40, 70, 80],
        stepName: ['Inspirez', 'Retenez', 'Expirez'],
        stepColor: ['primary', 'warning', 'golden'],
    };

    let [step, setStep] = useState<number>(0);

    const { seconds } = useScoreTimer(timeActive, 100);
    const { setSeconds } = useContext(TimerContext);

    const { musicPlaying, setMusicPlaying, setResetMusic } = useAudioPlayer();

    const { countdownOverlaySeconds } = useCountdownOverlay(isModal);
    const { setCountdownOverlaySeconds } = useContext(CountdownContext);

    // CHRONO
    const [changeDataCountdown, setChangeDataCountdown] = useState<boolean>(
        false
    );

    const [play, setPlay] = useState<any>(null);
    const [animationState, setAnimationState] = useState<string>('paused');

    useEffect(() => {
        // console.log(typeof seconds);
        // console.log(typeof chronoStep.stepSeconds[0]);
        if (timeActive === true) {
            if (seconds > chronoStep.stepSeconds[step]) {
                setStep(step + 1);
                setSeconds(1);
            }
            if (step === 2 && seconds > chronoStep.stepSeconds[step]) {
                setStep(0);
                setSeconds(1);
            }
        } else {
            setSeconds(1);
        }
    }, [seconds]);

    useEffect(() => {
        if (play === true) {
            setIsModal(true);
            if (isModal && countdownOverlaySeconds === 0) {
                setAnimationState('running');
                setIsModal(false);
                setChangeDataCountdown(true);
                setTimeActive(!timeActive);
            }
        }
    }, [play, countdownOverlaySeconds]);

    useEffect(() => {
        if (play === false) {
            setAnimationState('paused');
            setTimeActive(!timeActive);
        }
    }, [play]);

    function displayCount(count) {
        let res = count / 10;
        return Math.ceil(res);
    }

    function reset() {
        setPlay(null);
        setStep(0);
        setSeconds(1);
        setTimeActive(false);
        setAnimationState('paused');
        setResetMusic(true);
        setMusicPlaying(false);
        setChangeDataCountdown(false);
    }

    return (
        <BgImage imageUrl={`${Path.imgPath}hero.jpg`}>
            <Container maxWidth="991px" isCenteredX>
                <div className="_px-sm">
                    <TabsGroup
                        noTabsonDesktop={true}
                        contents={[
                            {
                                title: 'Option',
                                subcontent: (
                                    <aside className="_my-md">
                                        <TabsGroup
                                            borderBottomStyle={true}
                                            isCard={true}
                                            contents={[
                                                {
                                                    title: 'étapes',
                                                    subcontent: [
                                                        {
                                                            content: (
                                                                <OrderedList
                                                                    lists={[
                                                                        {
                                                                            color:
                                                                                chronoStep.stepColor &&
                                                                                chronoStep
                                                                                    .stepColor[0],
                                                                            content: `Fermez la bouche et inspirez tranquillement par le nez en comptant jusqu'à 4.`,
                                                                        },
                                                                        {
                                                                            color:
                                                                                chronoStep.stepColor &&
                                                                                chronoStep
                                                                                    .stepColor[1],
                                                                            content: `Retenez votre souffle en comptant jusqu'à 7.`,
                                                                        },
                                                                        {
                                                                            color:
                                                                                chronoStep.stepColor &&
                                                                                chronoStep
                                                                                    .stepColor[2],
                                                                            content: `Expirez bruyamment par la bouche en comptant jusqu'à 8 et en faisant le son "whoosh".`,
                                                                        },
                                                                    ]}
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            title:
                                                                'Avant de commencer',
                                                            content: `Fermez les yeux et expirez tout l'air de vos poumons. Touchez votre palais du bout de la langue, juste derrière les incisives, et conservez cette position pendant l'exercice`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    title: 'le saviez-vous ?',
                                                    subcontent: `Cet exercice permet de diminuer le stress, et peut également vous aider à vous endormir. Idéalement, mettez-vous assis le dos bien droit, les pieds à plat au sol. Vous pouvez également pratiquer cet exercice debout, ou couché dans votre lit.`,
                                                },
                                            ]}
                                        />
                                    </aside>
                                ),
                            },
                            {
                                title: 'Jouer',
                                subcontent: (
                                    <section>
                                        <Modal
                                            title="Partie terminée"
                                            isModal={isModal}
                                            isOverlay={true}
                                            onCloseBtnClick={() => {
                                                setCountdownOverlaySeconds(0);
                                            }}>
                                            <span className="_text-white">
                                                {changeDataCountdown === false
                                                    ? 'Début dans :'
                                                    : 'Reprise dans :'}
                                            </span>
                                            <span className="_text-xxl _text-white _py-sm">
                                                {countdownOverlaySeconds}
                                            </span>
                                            <div
                                                className="_w-4/5 _bg-white _rounded-small _border-solid _border-2 _p-sm _border-white _flex"
                                                style={{
                                                    backgroundColor:
                                                        'rgba(255,255,255,.3)',
                                                }}>
                                                <div className="_mr-xs">
                                                    <InfoSvg
                                                        fillColor="#fff"
                                                        svgWidth="20px"
                                                        svgHeight="20px"></InfoSvg>
                                                </div>
                                                <span className="_text-white">
                                                    Essayez de respirer par le
                                                    ventre pendant cet exercice
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
                                                        {
                                                            chronoStep.stepName[
                                                                step
                                                            ]
                                                        }
                                                    </span>
                                                )}
                                                <div className="c-chrono-player _relative _flex _justify-center _items-center">
                                                    <CircleGrow
                                                        isPlaying={play}
                                                        playingStep={step}
                                                        borderColor={
                                                            chronoStep
                                                                .stepColor[step]
                                                        }
                                                        playingState={
                                                            animationState
                                                        }></CircleGrow>
                                                    {play === null && (
                                                        <span
                                                            className="_text-lg _text-primary _p-xs _text-center _z-10"
                                                            role="status"
                                                            aria-live="polite">
                                                            Cliquez sur lecture
                                                            pour commencer
                                                        </span>
                                                    )}
                                                    {play !== null && (
                                                        <span className="_text-center _text-xxl _text-primary _z-10">
                                                            {displayCount(
                                                                seconds
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </section>
                                        <PlayerControls
                                            play={play}
                                            isPlaying={musicPlaying}
                                            audioFile={'Soul-Colors.mp3'}
                                            onClick={{
                                                reset: () => reset(),
                                                pause: () => {
                                                    setCountdownOverlaySeconds(
                                                        changeDataCountdown
                                                            ? 3
                                                            : 5
                                                    );
                                                    setPlay(!play);
                                                },
                                                audio: () => {
                                                    setResetMusic(false);
                                                    setMusicPlaying(
                                                        !musicPlaying
                                                    );
                                                },
                                            }}
                                        />
                                        <Audio
                                            id="audio"
                                            audioFile={'bip.mp3'}></Audio>
                                    </section>
                                ),
                            },
                        ]}
                    />
                </div>
            </Container>
        </BgImage>
    );
};

export default Main;
