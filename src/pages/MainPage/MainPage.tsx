import {FC, useState} from "react";
import {useGetUserQuery} from "../../service/api/userApi";
import {Button} from "../../components/Button/Button";
import {Link, useHistory} from "react-router-dom";
import styleMainPage from './MainPage.module.css'
import {Loading} from "../../components/Loading/Loading";
import {ModalProfileEdit} from "../../components/ModalProfileEdit/ModalProfileEdit";
import {ModalPhoto} from "../../components/ModalPhoto/ModalPhoto";
import {Input} from "../../components/Input/Input";
import {CreatePost} from "../../components/CreatePost/CreatePost";
import {IPost} from "../../types/types";
export const MainPage: FC = () => {
    const [modalPhotoActive,setModalPhotoActive] = useState(false)
    const [modalActive, setModalActive] = useState(false)
    const id = window.localStorage.getItem('id')
    const {data, isLoading} = useGetUserQuery(id)
    const history = useHistory()
    const exitUser = () => {
        window.localStorage.removeItem('id')
        window.localStorage.removeItem('token')
        history.replace({pathname: "/login"})
    }
    if(isLoading) {
        return <Loading/>
    }

    const activeModal = () => {
        setModalActive(true)
    }
    const closeModal = () => {
        setModalActive(false)
    }
    const closeModalUserPhoto = () => {
        setModalPhotoActive(false)
    }
    const activeModalUserPhoto = () => {
        setModalPhotoActive(true)
    }
    return (
        <div>
            <header className={styleMainPage.header}>
                <h1 className={styleMainPage.title}>В мыле</h1>
                <Button text="Выйти" classname={styleMainPage.btn} onclick={exitUser}/>
            </header>
            <menu className={styleMainPage.menu}>
                <Link className={styleMainPage.link} to="/">Моя страница</Link>
                <Link className={styleMainPage.link} to="/friends">Друзья</Link>
                <Link className={styleMainPage.link} to="/post">Новости</Link>
                <Link className={styleMainPage.link} to="/mail">Сообщения</Link>
            </menu>
            <main className={styleMainPage.main}>
                <div className={styleMainPage.profile}>
                    {data && data.photo === "null" ? (
                        <div className={styleMainPage.img}>?</div>
                        ) : (
                            <>
                        <img onClick={activeModalUserPhoto} className={styleMainPage.img} src={data && data.photo} alt="Я"/>
                                <ModalPhoto closeModal={closeModalUserPhoto} imgSrc={data && data.photo} isActive={modalPhotoActive} />
                            </>
                        )
                            }
                    <p className={styleMainPage.name}>{data && data.name}</p>
                    <p className={styleMainPage.email}>{data && data.email}</p>
                    <p className={styleMainPage.city}>Город : {data && data.city === 'null' || data.city === '' ? "Не указан" : data.city}</p>
                    <p className={styleMainPage.descr}>{data && data.description === 'null' || data.description === '' ? "Описание не указано" : data.description}</p>
                    {<p className={styleMainPage.age}>Возраст : {data && data.age === 0 || data.age === '' ? " не указан" : data.age}</p>}
                    <p className={styleMainPage.univ}>ВУЗ: {data && data.univ === "null" || data.univ === '' ? " не указан" : data.univ}</p>
                    <Button onclick={activeModal} classname={styleMainPage.btnProf} text="Редактировать"/>
                    <p className={styleMainPage.friends}>Друзей: {data && data.friends.length}</p>
                    <p className={styleMainPage.posts}>Постов: {data && data.posts.length}</p>
                </div>
                <div className={styleMainPage.list}>
                   <h2 className={styleMainPage.subtitle}>Мои посты :</h2>
                    <CreatePost/>
                    <ul>
                        {data && data.posts.map((post: IPost) => {
                            return (
                                <li>
                                    {post.photo === 'null' ? '' : (<img src={post.photo}/>)}
                                <p>{post.description}</p>
                                    <p>Лайков: {post.likes}</p>
                                </li>
                            )
                        }).reverse()}
                    </ul>
                </div>
            </main>

            <ModalProfileEdit data={data} isActive={modalActive} closeModal={closeModal}/>
        </div>
    )
}