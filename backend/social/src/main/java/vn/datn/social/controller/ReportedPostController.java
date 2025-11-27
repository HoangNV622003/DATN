package vn.datn.social.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.constant.NotificationType;
import vn.datn.social.dto.request.ReportPostRequest;
import vn.datn.social.entity.Notification;
import vn.datn.social.entity.Post;
import vn.datn.social.entity.ReportedPost;
import vn.datn.social.entity.User;
import vn.datn.social.service.NotificationService;
import vn.datn.social.service.PostService;
import vn.datn.social.service.ReportedPostService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportedPostController {

    private final ReportedPostService reportedPostService;
    private final PostService postService;
    private final NotificationService notificationService;

    @PostMapping("/report")
    public ResponseEntity<String> reportPost(@RequestBody ReportPostRequest reportRequest) {
        boolean success = reportedPostService.reportPost(reportRequest.getPostId(), reportRequest.getReportedBy(), reportRequest.getReason());
        if (success) {
            return ResponseEntity.ok("Report successfully submitted.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to report post. Post not found.");
        }
    }

    @GetMapping
    public ResponseEntity<Page<ReportPostRequest>> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<ReportPostRequest> reports = reportedPostService.getAllReports(page, size);
        return ResponseEntity.ok(reports);
    }

    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        try {
            // Lấy bài viết cần xóa
            Post post = postService.findPostById(postId);
            if (post == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
            }

            // Lấy danh sách các báo cáo liên quan đến bài viết
            List<ReportedPost> reportedPosts = reportedPostService.findByPostId(postId);

            // Lấy thông tin tác giả bài viết
            User author = post.getUser();

            // Tạo thông báo cho tác giả
            Notification authorNotification = new Notification();
            authorNotification.setContentnoti("Your post has been deleted by an admin.");
            authorNotification.setType(NotificationType.LIKE_COMMENT_SHARE);
            authorNotification.setSender(null); // Admin
            authorNotification.setReceiver(author);
            authorNotification.setStatus("unread");
            authorNotification.setTimestamp(LocalDateTime.now());
            notificationService.save(authorNotification);

            // Tạo thông báo cho từng người đã báo cáo bài viết

            // Xóa bài viết và các báo cáo liên quan
            reportedPostService.deleteByPostId(postId);
            postService.deleteById(postId);

            return ResponseEntity.ok("Post deleted successfully!");
        } catch (Exception e) {
            // Xử lý lỗi
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting post");
        }
    }

    @DeleteMapping("/ignore/{reportId}")
    public ResponseEntity<String> ignorePost(@PathVariable Long reportId) {
        try {

            boolean isDeleted = reportedPostService.removeReport(reportId);
            if (isDeleted) {
                return ResponseEntity.ok("Post with ID " + reportId + " has been ignored successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Post with ID " + reportId + " was not found in the reported list.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while trying to ignore the post.");
        }
    }
}
