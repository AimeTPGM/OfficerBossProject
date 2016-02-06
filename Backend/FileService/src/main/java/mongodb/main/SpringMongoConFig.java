package mongodb.main;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;

import com.mongodb.Mongo;

@Configuration
public class SpringMongoConFig extends AbstractMongoConfiguration{
	@Bean
	public GridFsTemplate gridFsTemplate() throws Exception {
		return new GridFsTemplate(mongoDbFactory(), mappingMongoConverter());
	}

	@Override
	protected String getDatabaseName() {
		return MongoDBMain.getDBName();
	}

	@Override
	public Mongo mongo() throws Exception {
		return MongoDBMain.getMongoClient();
	}

}
