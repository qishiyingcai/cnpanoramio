package com.cnpanoramio.dao.impl.hibernate;

import java.util.List;

import org.appfuse.dao.hibernate.GenericDaoHibernate;
import org.appfuse.model.User;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.cnpanoramio.dao.PhotoDao;
import com.cnpanoramio.domain.Comment;
import com.cnpanoramio.domain.Photo;

@Repository("photoDao")
public class PhotoDaoImpl extends GenericDaoHibernate<Photo, Long> implements PhotoDao {

	public PhotoDaoImpl() {
		super(Photo.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Photo> getUserPhotos(User user) {
		Query photoListQuery = getSession().createQuery("from Photo p where owner = :owner");
				
		photoListQuery.setParameter("owner", user);

		return photoListQuery.list();
	}
	
	public Photo savePhoto(Photo photo) {
        if (log.isDebugEnabled()) {
            log.debug("photo's id: " + photo.getId());
        }
        getSession().saveOrUpdate(photo);
        // necessary to throw a DataIntegrityViolation and catch it in UserManager
        getSession().flush();
        return photo;
    }

	@Override
	public Photo save(Photo photo) {
		return this.savePhoto(photo);
	}

	@Override
	public List<Photo> getUserPhotos(User user, int pageSize, int pageNo) {
		Query query = getSession().createQuery("from Photo where owner = :owner");
		
		query.setParameter("owner", user);
		query.setFirstResult((pageNo - 1) * pageSize);  
        query.setMaxResults(pageSize);  
  
		List<Photo> res = query.list();
		return res;
	}

	@Override
	public int getPhotoCount(User user) {
		Query query = getSession().createQuery("select count(*) from Photo where owner = :owner");
		
		query.setParameter("owner", user);
		
		return ((Long)query.list().get(0)).intValue();
	}

	@Override
	public Photo delete(Long id) {
		Photo photo = get(id);
		photo.setDeleted(true);
		save(photo);
		return photo;
	}
}
