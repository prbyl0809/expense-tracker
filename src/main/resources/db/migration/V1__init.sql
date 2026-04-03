CREATE TABLE app_user (
                          id BIGSERIAL PRIMARY KEY,
                          email VARCHAR(255) NOT NULL UNIQUE,
                          password_hash VARCHAR(255) NOT NULL,
                          display_name VARCHAR(255) NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category (
                          id BIGSERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          type VARCHAR(20) NOT NULL,
                          user_id BIGINT NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT fk_category_user
                              FOREIGN KEY (user_id) REFERENCES app_user(id)
                                  ON DELETE CASCADE
);

CREATE TABLE financial_transaction (
                                       id BIGSERIAL PRIMARY KEY,
                                       amount NUMERIC(15,2) NOT NULL,
                                       type VARCHAR(20) NOT NULL,
                                       description TEXT,
                                       date DATE NOT NULL,
                                       user_id BIGINT NOT NULL,
                                       category_id BIGINT NOT NULL,
                                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                       CONSTRAINT fk_transaction_user
                                           FOREIGN KEY (user_id) REFERENCES app_user(id)
                                               ON DELETE CASCADE,

                                       CONSTRAINT fk_transaction_category
                                           FOREIGN KEY (category_id) REFERENCES category(id)
                                               ON DELETE CASCADE
);