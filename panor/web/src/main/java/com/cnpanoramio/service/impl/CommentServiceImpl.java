package com.cnpanoramio.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.cxf.ws.addressing.wsdl.Anonymous;
import org.appfuse.model.User;
import org.appfuse.service.UserManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cnpanoramio.dao.CommentDao;
import com.cnpanoramio.dao.PhotoDao;
import com.cnpanoramio.domain.Photo;
import com.cnpanoramio.json.Comment;
import com.cnpanoramio.json.PhotoComments;
import com.cnpanoramio.service.CommentService;
import com.cnpanoramio.utils.UserUtil;

@Service("commentService")
@Transactional
public class CommentServiceImpl implements CommentService {

	private transient final Log log = LogFactory.getLog(CommentService.class);
	
	@Autowired
	private UserManager userManager;
	@Autowired
	private PhotoDao photoDao;
	@Autowired
	private CommentDao commentDao;
	
	private SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
	
	@Override
	public Comment save(Comment comment) {
		
		User me = UserUtil.getCurrentUser(userManager);
		
		com.cnpanoramio.domain.Comment commentD = new com.cnpanoramio.domain.Comment();
		commentD.setComment(comment.getContent());
		commentD.setCreateTime(Calendar.getInstance());
		commentD.setUser(me);
		Photo photo = photoDao.get(comment.getPhotoId());
		commentD.setPhoto(photo);
		commentD = commentDao.save(commentD);
		
		comment.setId(commentD.getId());
		comment.setUsername(me.getUsername());
		
		return comment;		
	}
	
	public boolean delete(Long id) {		
		
		User me = UserUtil.getCurrentUser(userManager);
		com.cnpanoramio.domain.Comment commentD = commentDao.get(id);
		if(commentD.getUser().getId() == me.getId()) {
			commentDao.remove(commentD);
			return true;
		}
		
		return false;
	}

	public PhotoComments getComments(Long id, int pageSize, int pageNo) {
		List<com.cnpanoramio.domain.Comment> comments = commentDao.getCommentPager(id, pageSize, pageNo);
		PhotoComments pc = new PhotoComments();
		pc.setId(id);
		List<Comment> cs = new ArrayList<Comment>();
		for(com.cnpanoramio.domain.Comment comment : comments) {
			Comment c1 = new Comment();
			c1.setId(comment.getId());
			c1.setUserId(comment.getUser().getId());
			c1.setUsername(comment.getUser().getUsername());
			c1.setCreateTime(format.format(comment.getCreateTime().getTime()));
			c1.setContent(comment.getComment());
			cs.add(c1);
		}
		pc.setComments(cs);
		
		return pc;
	}
	
	public Long getCount(Long id) {
		return commentDao.getCommentSize(id);
	}
}
