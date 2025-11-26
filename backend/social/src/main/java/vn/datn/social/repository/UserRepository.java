package vn.datn.social.repository;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.datn.social.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmailIgnoreCase(String email);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByVerificationCode(String verificationCode);
    @Query(value = "SELECT address, COUNT(*) AS user_count " +
                   "FROM user " +
                   "GROUP BY address " +
                   "ORDER BY user_count DESC", nativeQuery = true)
    List<Object[]> getUsersByAddress();
}
