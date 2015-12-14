<?php
	$userGroup = <<<__QUERY
	CREATE TABLE IF NOT EXISTS `userGroup` (
 		`name` varchar(255) NOT NULL,
  		`pass` varchar(255) NOT NULL,
  		`ID` int(11) NOT NULL AUTO_INCREMENT,
  		PRIMARY KEY (`ID`),
  		UNIQUE KEY `ID` (`ID`),
  		UNIQUE KEY `name_2` (`name`),
  		KEY `name` (`name`)
	) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=24 ;


__QUERY;
	$place = <<<__QUERY
	CREATE TABLE IF NOT EXISTS `place` (
		`name` varchar(255) NOT NULL,
		`address` text NOT NULL,
		`lat` double NOT NULL,
		`lng` double NOT NULL,
		`group_key` int(11) NOT NULL,
		`sub_group` varchar(30) DEFAULT NULL,
		`position` int(11) DEFAULT NULL,
		`visited` tinyint(1) NOT NULL DEFAULT '0',
		`ID` int(11) NOT NULL AUTO_INCREMENT,
  		PRIMARY KEY (`ID`),
  		UNIQUE KEY `ID` (`ID`)
	) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=228 ;

__QUERY;
	$user = <<<__QUERY
	CREATE TABLE IF NOT EXISTS `user` (
  		`first_name` varchar(35) NOT NULL,
		`last_name` varchar(35) NOT NULL,
		`username` varchar(35) NOT NULL,
		`pass` varchar(255) NOT NULL,
		`email` varchar(255) NOT NULL,
		`group_key` int(11) DEFAULT NULL,
		`sub_group` varchar(30) DEFAULT NULL,
		`lat` float NOT NULL,
		`lng` float NOT NULL,
		`zoom` int(3) NOT NULL,
		`ID` int(11) NOT NULL AUTO_INCREMENT,
		PRIMARY KEY (`ID`),
		UNIQUE KEY `ID` (`ID`),
		UNIQUE KEY `email` (`email`),
		UNIQUE KEY `username` (`username`)
	) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=68 ;

__QUERY;

?>