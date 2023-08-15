//Essa função foi feita para realizar o envio de um contato referente ao DPO da empresa

import React, { useState } from "react";
import { useCssHandles } from "vtex.css-handles";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { GuardSpinner } from "react-spinners-kit";
import { BsCheck2Circle, BsExclamationCircle } from "react-icons/bs";

import "./index.css";

const CSS_HANDLES = [
    "malFcdMain",
    "malFcdWrapper",
    "malFcdForm",
    "malFcdBlockField",
    "malFcdBlockSubField",
    "malFcdBlockFieldDouble",
    "malFcdFieldLabel",
    "malFcdFieldInput",
    "malFcdFieldInputError",
    "malFcdFieldSelect",
    "malFcdFieldTextarea",
    "malFcdBlockSubmit",
    "malFcdSubmit"
]

const CSS_LOADING_HANDLES = [
    "malFcdLoading",
    "malFcdLoadingBlock",
    "malFcdLoadingTitle",
    "malFcdLoadingSubTitle"
]

const CSS_SUCCESS_HANDLES = [
    "malFcdSuccess",
    "malFcdSuccessBlock",
    "malFcdSuccessTitle",
    "malFcdSuccessSubTitle"
]

const CSS_ERROR_HANDLES = [
    "malFcdError",
    "malFcdErrorBlock",
    "malFcdErrorTitle",
    "malFcdErrorSubTitle"
]

const FormContactDpo = () => {

    // Instance the generator of class
    const handlesUser = useCssHandles(CSS_HANDLES);
    const hc = handlesUser.handles; // handle classes

    const handlesLoading = useCssHandles(CSS_LOADING_HANDLES);
    const ld = handlesLoading.handles; // handle classes

    const handlesSuccess = useCssHandles(CSS_SUCCESS_HANDLES);
    const sc = handlesSuccess.handles; // handle classes

    const handlesError = useCssHandles(CSS_ERROR_HANDLES);
    const er = handlesError.handles; // handle classes


    // UseForm Instance
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue
    } = useForm();

    // Elements States
    const [showForm, setShowForm] = useState<Boolean>(true);
    const [loading, setLoading] = useState<Boolean>(false);
    const [success, setSuccess] = useState<Boolean>(false);
    const [formError, setFormError] = useState<Boolean>(false);

    const onSubmit = async (data: any, e: any) => {
        e.preventDefault();
        setShowForm(false);
        setLoading(true);

        setTimeout(async () => {
            try {
                const config: AxiosRequestConfig = {
                    method: "post",
                    url: '/api/dataentities/CW/documents',
                    headers: {
                        "Accept": "application/vnd.vtex.ds.v10+json",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    data: JSON.stringify(data)
                };
                const response: AxiosResponse = await axios(config);
                if (response.status == 201) {
                    let docId = response.data.DocumentId;
                    console.log("Id do doc: ", docId);

                    // Formatando o arquivo para binario
                    let file = data.documento[0];
                    let dataForm = new FormData();
                    dataForm.append(file.name.replace("documento", ""), file);

                    const configFile: AxiosRequestConfig = {
                        method: "post",
                        url: `/api/dataentities/CW/documents/${docId}/documento/attachments`,
                        data: dataForm,
                        headers: {
                            "Content-Type": "multipart/form-data;"
                        }
                    };
                    const responseFile: AxiosResponse = await axios(configFile);
                    if (responseFile.status == 204) {
                        setLoading(false);
                        setSuccess(true);
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    } else {
                        console.log("RequestFile diferente de 204. Veja: ", response.status);
                    }
                }
            } catch (error) {
                console.log("Erro no envio dos dados. Veja: ", error);
                setLoading(false);
                setFormError(true);
                setTimeout(function () {
                    window.location.reload();
                }, 3000);
            }
        }, 2000);
    }

    const RenderForm = () => {
        if (showForm) {
            return (
                <form onSubmit={handleSubmit(onSubmit)} className={hc.malFcdForm}>
                    <div className={hc.malFcdBlockFieldDouble}>
                        <div className={hc.malFcdBlockSubField}>
                            <label className={hc.malFcdFieldLabel} htmlFor="">Nome</label>
                            <input
                                className={hc.malFcdFieldInput}
                                placeholder="Nome"
                                type="text"
                                {...register("name", { required: "*Campo obrigatório" })}
                            />
                            <ErrorMessage
                                errors={errors}
                                name="name"
                                as="span"
                                className={hc.malFcdFieldInputError}
                            />
                        </div>
                        <div className={hc.malFcdBlockSubField}>
                            <label className={hc.malFcdFieldLabel} htmlFor="">E-mail</label>
                            <input
                                className={hc.malFcdFieldInput}
                                placeholder="E-mail"
                                type="e-mail"
                                {...register("email", { required: "*Campo obrigatório" })}
                            />
                            <ErrorMessage
                                errors={errors}
                                name="email"
                                as="span"
                                className={hc.malFcdFieldInputError}
                            />
                        </div>
                    </div>
                    <div className={hc.malFcdBlockFieldDouble}>
                        <div className={hc.malFcdBlockSubField}>
                            <label className={hc.malFcdFieldLabel} htmlFor="">Telefone</label>
                            <input
                                className={hc.malFcdFieldInput}
                                placeholder="Telefone"
                                type="text"
                                {...register("telephone", { required: "*Campo obrigatório" })}
                            />
                            <ErrorMessage
                                errors={errors}
                                name="telephone"
                                as="span"
                                className={hc.malFcdFieldInputError}
                            />
                        </div>
                        <div className={hc.malFcdBlockSubField}>
                            <label className={hc.malFcdFieldLabel} htmlFor="">Foto do documento pessoal</label>
                            <input
                                className={hc.malFcdFieldInput}
                                placeholder="Foto do documento pessoal"
                                type="file"
                                {...register("documento", { required: "*Campo obrigatório" })}
                            />
                            <ErrorMessage
                                errors={errors}
                                name="documento"
                                as="span"
                                className={hc.malFcdFieldInputError}
                            />
                        </div>
                    </div>
                    <div className={hc.malFcdBlockField}>
                        <label className={hc.malFcdFieldLabel}>Direitos do titular</label>
                        <select
                            className={hc.malFcdFieldSelect}
                            id="contactState"
                            {...register("subject", { required: "*Campo obrigatório" })}
                        >
                            <option value="">Selecione</option>
                            <option value="Acesso">Acesso</option>
                            <option value="Retificação">Retificação</option>
                            <option value="Oposição">Oposição</option>
                            <option value="Cancelamento">Cancelamento</option>
                            <option value="Explicação">Explicação</option>
                            <option value="Informação">Informação</option>
                            <option value="Portabilidade">Portabilidade</option>
                            <option value="Revisão de Decisões Automatizadas">Revisão de Decisões Automatizadas</option>
                        </select>
                        <ErrorMessage
                            errors={errors}
                            name="birthdate"
                            as="span"
                            className={hc.malFcdFieldInputError}
                        />
                    </div>
                    <div className={hc.malFcdBlockField}>
                        <label className={hc.malFcdFieldLabel} htmlFor="">Mensagem</label>
                        <textarea
                            className={hc.malFcdFieldTextarea}
                            {...register("message", { required: "*Campo obrigatório" })}
                        ></textarea>
                        <ErrorMessage
                            errors={errors}
                            name="message"
                            as="span"
                            className={hc.malFcdFieldInputError}
                        />
                    </div>
                    <div className={hc.malFcdBlockSubmit}>
                        <button className={hc.malFcdSubmit} type="submit">Enviar mensagem</button>
                    </div>
                </form>
            )
        } else {
            return null;
        }
    }

    const RenderLoading = () => {
        if (loading) {
            return (
                <div className={ld.malFcdLoading}>
                    <div className={ld.malFcdLoadingBlock}>
                        <span className={ld.malFcdLoadingTitle}>Aguarde!</span>
                        <span className={ld.malFcdLoadingSubTitle}>Não recarregue ou saia da página enquanto enviamos suas informações.</span>
                        <GuardSpinner frontColor={'#00ada8'} size={75} />
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }

    const RenderSuccess = () => {
        if (success) {
            return (
                <div className={sc.malFcdSuccess}>
                    <div className={sc.malFcdSuccessBlock}>
                        {/* <img src={IconSuccess} /> */}
                        <BsCheck2Circle color={'#00ada8'} size={85} />
                        <span className={sc.malFcdSuccessTitle}>Enviado!</span>
                        <span className={sc.malFcdSuccessSubTitle}>Assim que possivel entraremos em contato.</span>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }

    const RenderError = () => {
        if (formError) {
            return (
                <div className={er.malFcdError}>
                    <div className={er.malFcdErrorBlock}>
                        <BsExclamationCircle color={'#e43635'} size={85} />
                        <span className={er.malFcdErrorTitle}>Ops! Houve algum problema</span>
                        <span className={er.malFcdErrorSubTitle}>Algo de errado aconteceu no envio de dados tente novamente em alguns minutos.</span>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }

    return (
        <div className={hc.malFcdMain}>
            <div className={hc.malFcdWrapper}>
                <RenderForm />
                <RenderLoading />
                <RenderSuccess />
                <RenderError />
            </div>
        </div>
    )
}

export default FormContactDpo;
