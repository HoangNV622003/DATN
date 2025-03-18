// // src/pages/HomePage.jsx
// import React, { useState, useEffect } from 'react';
// import { memo } from 'react';
// import SearchBar from '../../../components/searchBar/SearchBar';
// import { fetchAllPost } from '../../../apis/posts/PostService';
// import ListPost from "../post/ListPost";
// import Pagination from '../../../components/pagination/Pagination';
// import "./style.scss";

// const HomePage = () => {
//     const [posts, setPosts] = useState({
//         content: [],
//         totalPages: 0,
//         number: 0,
//         first: true,
//         last: true,
//     });

//     const handlePageChange = (newPage) => {
//         setPosts((prev) => ({ ...prev, number: newPage }));
//     };

//     const handleLoadPost = async (page) => {
//         try {
//             const response = await fetchAllPost(page);
//             if (response && response.content) {
//                 setPosts({
//                     content: response.content,
//                     totalPages: response.totalPages,
//                     number: response.number,
//                     first: response.first,
//                     last: response.last,
//                 });
//             } else {
//                 console.error("Dữ liệu không hợp lệ:", response);
//                 setPosts({ content: [], totalPages: 0, number: 0, first: true, last: true });
//             }
//         } catch (error) {
//             console.error("Lỗi khi tải bài viết:", error);
//             setPosts({ content: [], totalPages: 0, number: 0, first: true, last: true });
//         }
//     };

//     useEffect(() => {
//         handleLoadPost(posts.number);
//     }, [posts.number]);

//     return (
//         <div className="container__home">
//         <div className="container__search__bar">
//           <SearchBar initialProvince={null}
//                     initialDistricts={[]}
//                     initialWards={[]}/>
//         </div>
//         <div className="list__post">
//           <ListPost posts={posts.content} />
//         </div>
//         <div className="navigation__paging">
//           <Pagination posts={posts} onPageChange={handlePageChange} />
//         </div>
//       </div>
//     );
// };

// export default memo(HomePage);
// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { memo } from 'react';
import SearchBar from '../../../components/searchBar/SearchBar';
import { fetchAllPost } from '../../../apis/posts/PostService';
import ListPost from "../post/ListPost";
import Pagination from '../../../components/pagination/Pagination';
import "./style.scss";

const HomePage = () => {
    const [posts, setPosts] = useState({
        content: [],
        totalPages: 0,
        number: 0,
        first: true,
        last: true,
    });

    const handlePageChange = (newPage) => {
        setPosts((prev) => ({ ...prev, number: newPage }));
    };

    const handleLoadPost = async (page) => {
        try {
            const response = await fetchAllPost(page);
            if (response && response.content) {
                setPosts({
                    content: response.content,
                    totalPages: response.totalPages,
                    number: response.number,
                    first: response.first,
                    last: response.last,
                });
            } else {
                console.error("Dữ liệu không hợp lệ:", response);
                setPosts({ content: [], totalPages: 0, number: 0, first: true, last: true });
            }
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error);
            setPosts({ content: [], totalPages: 0, number: 0, first: true, last: true });
        }
    };

    useEffect(() => {
        handleLoadPost(posts.number);
    }, [posts.number]);

    return (
        <div className="container__home">
            <div className="container__search__bar">
                <SearchBar
                    initialProvince={null}
                    initialDistricts={[]}
                    initialWards={[]}
                /> {/* Không cần onSearch, sẽ dùng navigate mặc định */}
            </div>
            <div className="list__post">
                <ListPost posts={posts.content} />
            </div>
            <div className="navigation__paging">
                <Pagination posts={posts} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default memo(HomePage);