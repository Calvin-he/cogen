package com.learning.cognitiveenglish.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.ui.ModelMap;

import java.util.function.Consumer;

/**
 * Created by pt on 17-2-6.
 */
public class BaseController {
    @Autowired
    protected PlatformTransactionManager transactionManager;
    protected Logger logger = LoggerFactory.getLogger(getClass());

    final protected void transactional(Consumer<DefaultTransactionDefinition> txDef) {
        DefaultTransactionDefinition transactionDef = new DefaultTransactionDefinition();
        transactionDef.setName(null);
        transactionDef.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        transactionDef.setTimeout(TransactionDefinition.TIMEOUT_DEFAULT);
        TransactionStatus status = transactionManager.getTransaction(transactionDef);
        try {
            txDef.accept(transactionDef);
            transactionManager.commit(status);
        } catch (Exception ex) {

            transactionManager.rollback(status);
            throw ex;
        }
    }

    final protected ModelMap mapOf(String key, Object value){
        return new ModelMap(key, value);
    }

}
