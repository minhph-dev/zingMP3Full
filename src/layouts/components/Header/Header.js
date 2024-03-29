import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import Tippy from '@tippyjs/react';
import Search from '../Search';
import {
    faArrowLeftLong,
    faArrowRightLong,
    faBars,
    faGear,
    faShirt,
    faUpload,
} from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.scss';
import { faVuejs } from '@fortawesome/free-brands-svg-icons';
import Button from '~/components/Button';
import { setIsExtendSidebar, setIsOpenThemModal } from '~/redux/audioSlice';

const cx = classNames.bind(styles);

function Header() {
    const dispatch = useDispatch();
    const handleOpenSidebar = () => {
        dispatch(setIsExtendSidebar(true));
    };
    const isOpenThemModal = useSelector((state) => state.audio.isOpenThemModal);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('left')}>
                <div className={cx('icon')}>
                    <Button circlem className={cx('icon-row')}>
                        <FontAwesomeIcon icon={faArrowLeftLong} />
                    </Button>
                    <Button circlem className={cx('icon-row')}>
                        <FontAwesomeIcon icon={faArrowRightLong} />
                    </Button>
                    <Button circlem className={cx('icon-bar')} onClick={handleOpenSidebar}>
                        <FontAwesomeIcon icon={faBars} />
                    </Button>
                </div>
                <div className={cx('search-fields')}>
                    <Search />
                </div>
            </div>
            <div className={cx('right')}>
                <Tippy content="Chủ đề" placement="bottom">
                    <span
                        className={cx('icon')}
                        onClick={() => {
                            dispatch(setIsOpenThemModal(!isOpenThemModal));
                        }}
                    >
                        <FontAwesomeIcon icon={faShirt} />
                    </span>
                </Tippy>
                <Tippy content="Nâng cấp VIP">
                    <span className={cx('icon')}>
                        <FontAwesomeIcon icon={faVuejs} />
                    </span>
                </Tippy>
                <Tippy content="Tải lên">
                    <span className={cx('icon', 'upload')}>
                        <FontAwesomeIcon icon={faUpload} />
                    </span>
                </Tippy>
                <Tippy content="Cài đặt">
                    <span circlem="true" className={cx('icon')}>
                        <FontAwesomeIcon icon={faGear} />
                    </span>
                </Tippy>
                <Button circlem="true" className={cx('icon', 'img')}>
                    <img
                        src="https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.9.109/static/media/user-default.3ff115bb.png"
                        alt="logo"
                    />
                </Button>
            </div>
        </div>
    );
}

export default Header;
