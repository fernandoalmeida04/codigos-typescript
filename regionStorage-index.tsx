//Essa função foi feita para capturar o cep do usuário para calcular os valores de frete para melhor navegação

/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useLazyFullSession, useUpdateSession } from 'vtex.session-client';
import { useCssHandles } from "vtex.css-handles";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import { ErrorMessage } from "@hookform/error-message";
import LocationIcon from "./LocationIcon";
import "./index.css";

/* eslint-disable */
import CloseIcon from "../../assets/imgs/mal-icon-close.png";

const CSS_HANDLES = [
    "malRsMain",
    "malRsBlockOpen",
    "malRsTextOpen",
    "malRsBlockForm",
    "malRsBlockFormOpen",
    "malRsBtnClose",
    "malRsForm",
    "malRsTitle",
    "malRsSubTitle",
    "malRsInput",
    "malRsBtnSubmit",
    "malRsLink",
    "malRsBgOverlay",
    "malRsBgOverlayOpen"
];

const RegionStorage = () => {

    // Instance the generator of class
    const handlesUser = useCssHandles(CSS_HANDLES);
    const hc = handlesUser.handles; // handle classes

    // UseForm Instance
    const { register, formState: { errors }, handleSubmit, reset, control } = useForm();

    // State to Elements
    const [blockForm, setBlockForm] = useState('');
    const [bgOverlay, setBgOverlay] = useState('');

    // State to Infos
    const [streetInfo, setStreetInfo] = useState('CEP');

    const openForm = (e) => {
        e.preventDefault();

        setBlockForm(hc.malRsBlockFormOpen);
        setBgOverlay(hc.malRsBgOverlayOpen);
    }

    const closeForm = (e) => {
        e.preventDefault();

        setBlockForm('');
        setBgOverlay('');
    }

    // const [getSession, session] = useLazyFullSession();
    // const updateSession = useUpdateSession();

    const onSubmit = (data) => {
        const cep = data.cep;
        fetch(`//viacep.com.br/ws/${cep}/json/`).then((response) => {
            response.json().then((data) => {
                if (data) {
                    const dataSplit = data.logradouro.split(' ');
                    const dataFirst = dataSplit[0].charAt(0);
                    localStorage.setItem('POSTAL_CEP', data.cep.replace('-', ''));
                    localStorage.setItem('POSTAL_LOGRA', `${dataFirst}.${dataSplit[1]} `);
                    setStreetInfo(`${dataFirst}.${dataSplit[1]} `);
                    window.location.reload();
                } else {
                    console.error('Failed retrieving information', data);
                    localStorage.removeItem('POSTAL_CEP');
                    localStorage.removeItem('POSTAL_LOGRA');
                    setStreetInfo('CEP');
                    window.location.reload();
                }
            });
        }).catch((err) => {
            console.error('Failed retrieving information', err);
            localStorage.removeItem('POSTAL_CEP');
            localStorage.removeItem('POSTAL_LOGRA');
            setStreetInfo('CEP');
        });

    }

    useEffect(() => {
        if (localStorage.getItem("POSTAL_CEP")) {
            let address: any = localStorage.getItem("POSTAL_LOGRA");
            setStreetInfo(address);
        }
    }, []);

    return (
        <div className={hc.malRsMain}>
            <div className={hc.malRsBlockOpen}>
                <LocationIcon />
                <span onClick={e => openForm(e)} className={hc.malRsTextOpen}>{streetInfo}</span>
            </div>
            <div className={`${hc.malRsBlockForm} ${blockForm}`}>
                <button onClick={e => closeForm(e)} className={hc.malRsBtnClose}></button>
                <span className={hc.malRsTitle}>Informe seu CEP</span>
                <span className={hc.malRsSubTitle}>Digite seu CEP e veja as melhores ofertas e condições de frete para a sua região</span>
                <form onSubmit={handleSubmit(onSubmit)} className={hc.malRsForm}>
                    <input
                        className={hc.malRsInput}
                        placeholder="99999999" {...register("cep")}
                        maxLength={8}
                    />
                    <ErrorMessage errors={errors} name="cep" as="span" />
                    <button className={hc.malRsBtnSubmit} type="submit"></button>
                </form>
                <a className={hc.malRsLink} href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank">Não sei meu CEP</a>
            </div>
            <div className={`${hc.malRsBgOverlay} ${bgOverlay}`}></div>
        </div>
    )
}


export default RegionStorage;