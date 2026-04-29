*** Settings ***
Library     Process
Library     Collections
Library     String


*** Variables ***
${BRIDGE_SCRIPT}    tests/robot/password_bridge.mjs
${NODE_BIN}         node


*** Test Cases ***
Generate Password With Full Criteria
    ${options}=    Set Variable    {"length":20,"uppercase":true,"lowercase":true,"numbers":true,"symbols":true}
    ${result}=    Run Process    ${NODE_BIN}    ${BRIDGE_SCRIPT}    ${options}    shell=${False}
    Should Be Equal As Integers    ${result.rc}    0
    ${stdout}=    Strip String    ${result.stdout}
    ${ok}=    Evaluate    __import__("json").loads(r'''${stdout}''')["ok"]
    ${valid}=    Evaluate    __import__("json").loads(r'''${stdout}''')["valid"]
    ${length}=    Evaluate    __import__("json").loads(r'''${stdout}''')["length"]
    Should Be True    ${ok}
    Should Be True    ${valid}
    Should Be Equal As Integers    ${length}    20

Generate Password Lowercase Only
    ${options}=    Set Variable    {"length":12,"uppercase":false,"lowercase":true,"numbers":false,"symbols":false}
    ${result}=    Run Process    ${NODE_BIN}    ${BRIDGE_SCRIPT}    ${options}    shell=${False}
    Should Be Equal As Integers    ${result.rc}    0
    ${stdout}=    Strip String    ${result.stdout}
    ${password}=    Evaluate    __import__("json").loads(r'''${stdout}''')["password"]
    Should Match Regexp    ${password}    ^[a-z]+$

Invalid Configuration Should Fail
    ${options}=    Set Variable    {"length":10,"uppercase":false,"lowercase":false,"numbers":false,"symbols":false}
    ${result}=    Run Process    ${NODE_BIN}    ${BRIDGE_SCRIPT}    ${options}    shell=${False}
    Should Not Be Equal As Integers    ${result.rc}    0
