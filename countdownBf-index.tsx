//Essa função foi feita para renderizar um countdown de quanto tempo falta para a próxima promoção de black friday

import React, { useEffect, useState } from "react";
import { useCssHandles } from "vtex.css-handles";
import "./index.css";

const CSS_HANDLES = [
    "malCtwMain",
    "malCtwWrapper",
    "malCtwBlockLeft",
    "malCtwBlockRight",
    "malCtwBlockTitle",
    "malCtwBlockDescription",
    "malCtwBlockCountdown",
    "malCtwFirstTitle",
    "malCtwSecondTitle",
    "malCtwDescriptionTitle",
    "malCtwBlockCountdown",
    "malCtwCountdownTitle",
    "malCtwCountdownWrapper",
    "malCtwCountdownItem",
    "malCtwCountdownItemDoubleDots",
    "malCtwCountdownTime",
    "malCtwCountdownDesc"
]


// const CountdownBf = ({ message = 'teste' }: PropCountdownBf) => {
const CountdownBf = () => {

    // Instance the generator of class
    const handlesUser = useCssHandles(CSS_HANDLES);
    const hc = handlesUser.handles; // handle classes

    // console.log("Visible: ", isVisible);

    const [expiryTime, setExpiryTime]: any = useState("25 nov 2023 22:00:00");
    const [countdownTime, setCountdownTime]: any = useState({
        countdownDays: '',
        countdownHours: '',
        countdownlMinutes: '',
        countdownSeconds: ''
    });

    const countdownTimer = () => {

        const timeInterval = setInterval(() => {

            const countdownDateTime: number = new Date(expiryTime).getTime();
            const currentTime: number = new Date().getTime();
            const remainingDayTime: number = countdownDateTime - currentTime;

            let totalDays: number = Math.floor(remainingDayTime / (1000 * 60 * 60 * 24));
            let totalHours: number = Math.floor((remainingDayTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let totalMinutes: number = Math.floor((remainingDayTime % (1000 * 60 * 60)) / (1000 * 60));
            let totalSeconds: number = Math.floor((remainingDayTime % (1000 * 60)) / 1000);

            let fmtDays: string = makeMeTwoDigits(totalDays);
            let fmtHours: string = makeMeTwoDigits(totalHours);
            let fmtMins: string = makeMeTwoDigits(totalMinutes);
            let fmtSec: string = makeMeTwoDigits(totalSeconds);

            const runningCountdownTime = {
                countdownDays: fmtDays,
                countdownHours: fmtHours,
                countdownMinutes: fmtMins,
                countdownSeconds: fmtSec
            }

            setCountdownTime(runningCountdownTime);

            if (remainingDayTime < 0) {
                clearInterval(timeInterval);
                setExpiryTime(false);
            }

        }, 1000);
    }

    function makeMeTwoDigits(n) {
        return (n < 10 ? "0" : "") + n;
    }

    useEffect(() => {
        countdownTimer();
    }, []);

    const RenderCountdown = () => {
        return (
            <ul className={hc.malCtwCountdownWrapper}>
                <li className={hc.malCtwCountdownItem}>
                    <span className={hc.malCtwCountdownTime}>{countdownTime.countdownDays}</span>
                    <span className={hc.malCtwCountdownDesc}>DIAS</span>
                </li>
                <li className={hc.malCtwCountdownItemDoubleDots}>:</li>
                <li className={hc.malCtwCountdownItem}>
                    <span className={hc.malCtwCountdownTime}>{countdownTime.countdownHours}</span>
                    <span className={hc.malCtwCountdownDesc}>HORAS</span>
                </li>
                <li className={hc.malCtwCountdownItemDoubleDots}>:</li>
                <li className={hc.malCtwCountdownItem}>
                    <span className={hc.malCtwCountdownTime}>{countdownTime.countdownMinutes}</span>
                    <span className={hc.malCtwCountdownDesc}>MINS</span>
                </li>
                <li className={hc.malCtwCountdownItemDoubleDots}>:</li>
                <li className={hc.malCtwCountdownItem}>
                    <span className={hc.malCtwCountdownTime}>{countdownTime.countdownSeconds}</span>
                    <span className={hc.malCtwCountdownDesc}>SEGS</span>
                </li>
            </ul>
        )
    }

    return (
        <div className={hc.malCtwMain}>
            <div className={hc.malCtwWrapper}>
                <div className={hc.malCtwBlockLeft}>
                    <div className={hc.malCtwBlockTitle}>
                        <span className={hc.malCtwFirstTitle}>Best</span>
                        <span className={hc.malCtwSecondTitle}>November</span>
                    </div>
                    <div className={hc.malCtwBlockDescription}>
                        <span className={hc.malCtwDescriptionTitle}>PREPARE-SE PARA O MAIOR EVENTO DO ANO</span>
                    </div>
                    <div className={hc.malCtwBlockCountdown}>
                        <span className={hc.malCtwCountdownTitle}>Faltam</span>
                        <RenderCountdown />
                    </div>
                </div>
                <div className={hc.malCtwBlockRight}>
                    <img src="https://malwee.vtexassets.com/arquivos/ids/435500/banner_lp_bf.jpg?v=637709622853530000" />
                </div>
            </div>
        </div>
    )
}

export default CountdownBf;
