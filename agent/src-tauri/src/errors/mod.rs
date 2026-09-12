use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug, Serialize)]
pub enum AgentError {
    #[error("System error: {0}")]
    System(String),
    #[error("Configuration error: {0}")]
    Config(String),
    #[error("Internal error: {0}")]
    Internal(String),
}
