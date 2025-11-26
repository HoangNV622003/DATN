package vn.datn.social.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.datn.social.entity.ReportedPost;

import java.util.List;

@Repository
public interface ReportedPostRepository extends JpaRepository<ReportedPost, Long> {
    List<ReportedPost> findByPostId(Long postId);


    boolean existsById(Long id);

    void deleteById(Long id);
}
