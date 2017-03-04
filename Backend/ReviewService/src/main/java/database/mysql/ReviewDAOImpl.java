package database.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import database.dao.ReviewDAO;
import main.model.Review;

public class ReviewDAOImpl implements ReviewDAO{
	
	private DataSource dataSource;
	private String table = "reviewtestonly";

	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}
	
	public void create(Review review) {
		String sql = "INSERT INTO "+table+
				"(documentId, approverId, reviewDesc, reviewDate, reviewStatus) VALUES (?, ?, ?, ?, ?)";
		Connection conn = null;

		try {
			conn = dataSource.getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, review.getDocumentId());
			ps.setString(2, review.getApproverId());
			ps.setString(3, review.getReviewDesc());
			ps.setString(4, review.getReviewDate());
			ps.setString(5, review.getReviewStatus());
			ps.executeUpdate();
			ps.close();

		} catch (SQLException e) {
			throw new RuntimeException(e);

		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {}
			}
		}
	}

	public List<Review> getAllReview() {
		String sql = "SELECT * FROM "+table;

		Connection conn = null;

		try {
			conn = dataSource.getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			List<Review> reviews = new ArrayList<Review>();
			Review review = null;
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				review = new Review();
				review = new Review(rs.getInt("reviewId")+"", 
						rs.getString("documentId"), 
						rs.getString("approverId"), 
						rs.getString("reviewDesc"), 
						rs.getString("reviewDate"), 
						rs.getString("reviewStatus")
						);
				reviews.add(review);
					
			}
			rs.close();
			ps.close();
			return reviews;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
				conn.close();
				} catch (SQLException e) {}
			}
		}
	}

	public Review readByDocument(String id, String approverId) {
		String sql = "SELECT * FROM "+table+" WHERE documentId = \'"+id+"\' AND approverId = \'"+approverId+"\'";

		Connection conn = null;

		try {
			conn = dataSource.getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			Review review = null;
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				review = new Review();
				review = new Review(rs.getInt("reviewId")+"", 
						rs.getString("documentId"), 
						rs.getString("approverId"), 
						rs.getString("reviewDesc"), 
						rs.getString("reviewDate"), 
						rs.getString("reviewStatus")
				);
			}
			rs.close();
			ps.close();
			return review;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
				conn.close();
				} catch (SQLException e) {}
			}
		}
	}

	public Review readByReviewId(String id) {
		String sql = "SELECT * FROM "+table+" WHERE reviewId = "+id;

		Connection conn = null;

		try {
			conn = dataSource.getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			Review review = null;
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				review = new Review();
				review = new Review(rs.getInt("reviewId")+"", 
						rs.getString("documentId"), 
						rs.getString("approverId"), 
						rs.getString("reviewDesc"), 
						rs.getString("reviewDate"), 
						rs.getString("reviewStatus")
				);
			}
			rs.close();
			ps.close();
			return review;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
				conn.close();
				} catch (SQLException e) {}
			}
		}
	}

	public int deleteByReviewId(String id) {
		int reviewId = Integer.parseInt(id);
		String sql = "DELETE FROM "+table+" WHERE reviewId = "+reviewId;

		Connection conn = null;

		try {
			conn = dataSource.getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.execute();
			ps.close();
			return 0;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
				conn.close();
				} catch (SQLException e) {}
			}
		}
	}

	public int deleteByDocumentId(String id) {
		String sql = "DELETE FROM "+table+" WHERE documentId = \'"+id+"\'";

		Connection conn = null;

		try {
			conn = dataSource.getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.execute();
			ps.close();
			return 0;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
				conn.close();
				} catch (SQLException e) {}
			}
		}
	}

}
