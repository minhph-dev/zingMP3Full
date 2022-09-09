import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional
import request from '~/utils/httpRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSearch } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { useDebounce } from '~/hooks';
import Button from '~/components/Buttons';
import SongItem from '~/components/SongItem';
import {
    setSongId,
    setInfoSongPlayer,
    setIsPlay,
    setLoop,
    setPlaylistSong,
    setIsRadioPlay,
    setPlaylistRandom,
} from '~/redux/features/audioSlice';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [disableBtn, setDisableBtn] = useState(true);

    const inputRef = useRef();

    const debounced = useDebounce(searchValue, 500);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!searchValue.trim()) {
            setSearchResult([]);
            return;
        }
        request
            .get(`/search`, {
                params: {
                    keyword: debounced,
                },
            })
            .then((res) => {
                console.log(res);
                setSearchResult(res.data.songs || []);
            });
    }, [debounced]);

    const handleChangeInput = (e) => {
        setSearchValue(e.target.value);
        if (e.target.value === '' || !e.target.value.trim()) {
            setDisableBtn(true);
        } else {
            setDisableBtn(false);
        }
    };

    const handleClearInput = () => {
        setSearchValue('');
        setDisableBtn(true);
        setSearchResult([]);
        inputRef.current.focus();
    };

    const handleSearchClick = () => {
        localStorage.setItem('searchKeyWord', inputRef.current.value);
        setSearchValue(inputRef.current.value);
        setShowResult(false);
    };
    const handleFocus = () => {
        setShowResult(true);
    };
    const handleHideResult = () => {
        setShowResult(false);
    };

    const handlePlaySong = (song) => {
        dispatch(setIsRadioPlay(false));
        dispatch(setIsPlay(false));
        dispatch(setSongId(song.encodeId));
        dispatch(setInfoSongPlayer(song));
        dispatch(setPlaylistSong([song]));
        dispatch(setPlaylistRandom([song]));
        dispatch(setLoop(true));
    };
    return (
        <div className={cx('wrapper')}>
            <Tippy
                placement="bottom"
                visible={showResult && searchResults.length > 0}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <h3 className={cx('search-title')}>Gợi ý kết quả</h3>
                        {searchResults.map((searchResult) => (
                            <SongItem
                                type="mini"
                                key={searchResult.encodeId}
                                data={searchResult}
                                onClick={() => handlePlaySong(searchResult)}
                            />
                        ))}
                    </div>
                )}
                interactive
                onClickOutside={handleHideResult}
            >
                <div className={cx('search-fields', searchResults.length > 0 && showResult && 'bg')}>
                    {searchValue && (
                        <Button
                            to={`/search/${searchValue}`}
                            state={{ keyword: searchValue }}
                            onClick={handleSearchClick}
                        >
                            <FontAwesomeIcon icon={faSearch} className={cx('search-btn')} />
                        </Button>
                    )}
                    <input
                        ref={inputRef}
                        value={searchValue}
                        className={cx('search-input')}
                        placeholder="Tìm kiếm bài hát, nghệ sĩ , lời bài hát..."
                        onChange={handleChangeInput}
                        onFocus={handleFocus}
                    />
                    {!!searchValue && (
                        <button className={cx('clear-btn')} onClick={handleClearInput}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                </div>
            </Tippy>
        </div>
    );
}

export default Search;